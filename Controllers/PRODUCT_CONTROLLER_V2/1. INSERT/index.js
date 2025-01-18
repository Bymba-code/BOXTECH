const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { executeQuery } = require('../../../Database/test');

const UPLOAD_PATH = 'uploads/files';
const CHUNK_DIR = path.join(UPLOAD_PATH, 'chunks');
const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

// Configure disk storage instead of memory storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.join(CHUNK_DIR, 'temp');
        fs.mkdirSync(tempDir, { recursive: true });
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadHandler = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 * 1024, // 20GB limit
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

async function combineChunksEfficiently(chunkDir, finalPath, totalChunks) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(finalPath);
        let currentChunk = 1;

        function appendNextChunk() {
            if (currentChunk > totalChunks) {
                writeStream.end();
                return;
            }

            const chunkPath = path.join(chunkDir, `${currentChunk}`);
            const readStream = fs.createReadStream(chunkPath);

            readStream.pipe(writeStream, { end: false });

            readStream.on('end', () => {
                fs.unlink(chunkPath, (err) => {
                    if (err) console.error(`Error deleting chunk ${currentChunk}:`, err);
                    currentChunk++;
                    appendNextChunk();
                });
            });

            readStream.on('error', (error) => {
                writeStream.end();
                reject(error);
            });
        }

        writeStream.on('finish', () => {
            // Clean up chunk directory after successful combination
            fs.rm(chunkDir, { recursive: true, force: true }, (err) => {
                if (err) console.error('Error cleaning up chunk directory:', err);
                resolve();
            });
        });

        writeStream.on('error', reject);

        appendNextChunk();
    });
}

const INSERT_FILES_V2 = async (req, res) => {
    try {
        uploadHandler(req, res, async (err) => {
            if (err) {
                console.error("Upload error:", err);
                return res.status(500).json({
                    success: false,
                    message: `File upload error: ${err.message}`
                });
            }

            const startTime = performance.now();
            const { chunkNumber, totalChunks, fileName } = req.body;

            if (!chunkNumber || !totalChunks || !fileName) {
                return res.status(400).json({
                    success: false,
                    message: "Missing chunk information"
                });
            }

            const chunkDir = path.join(CHUNK_DIR, fileName);
            fs.mkdirSync(chunkDir, { recursive: true });

            // Move uploaded chunk from temp to chunk directory
            if (req.files?.file?.[0]) {
                const tempPath = req.files.file[0].path;
                const chunkPath = path.join(chunkDir, chunkNumber);
                
                fs.renameSync(tempPath, chunkPath);

                // Check if all chunks are present
                const chunks = fs.readdirSync(chunkDir);
                if (chunks.length === parseInt(totalChunks)) {
                    const finalPath = path.join(UPLOAD_PATH, fileName);
                    
                    try {
                        await combineChunksEfficiently(chunkDir, finalPath, parseInt(totalChunks));
                        
                        const file_url = `/files/uploads/${fileName}`;
                        const img_url = req.files?.image ? `/files/uploads/${req.files.image[0].filename}` : null;

                        // Database insertion
                        const productId = await saveToDatabase(req.user.id, req.body, { file_url, img_url });

                        const endTime = performance.now();
                        return res.status(201).json({
                            success: true,
                            data: {
                                img_url,
                                file_url,
                                productId,
                                combiningTime: `${(endTime - startTime).toFixed(2)} ms`
                            },
                            message: "File upload complete"
                        });
                    } catch (error) {
                        console.error('Error combining chunks:', error);
                        return res.status(500).json({
                            success: false,
                            message: "Error combining file chunks"
                        });
                    }
                } else {
                    return res.status(200).json({
                        success: true,
                        message: `Chunk ${chunkNumber} of ${totalChunks} received`
                    });
                }
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
};

async function saveToDatabase(userId, productData, fileUrls) {
    const { 
        category = 1,
        file_type = "ss",
        product_name = "23",
        price = 23,
        short_desc = "23",
        long_desc = "23",
        size = "23",
        link = "23"
    } = productData;

    const query = `
        INSERT INTO products 
        (user, category, file_type, product_name, price, short_desc, long_desc, size, img_url, link, file, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
        userId, category, file_type, product_name, price,
        short_desc, long_desc, size, fileUrls.img_url,
        link, fileUrls.file_url, new Date()
    ]);

    await executeQuery(
        'INSERT INTO user_products (user, product, date) VALUES (?, ?, ?)',
        [userId, result.insertId, new Date()]
    );

    return result.insertId;
}

module.exports = { INSERT_FILES_V2, uploadHandler };
