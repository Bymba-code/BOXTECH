const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { executeQuery } = require('../../../Database/test');

const uploadPath = 'uploads/files';

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.memoryStorage(); 

const uploadHandler = multer({
    storage: storage,
    limits: {
        fileSize: 30 * 1024 * 1024 * 1024  // Allow up to 30GB file size.
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

const INSERT_FILES_V2 = async (req, res) => {
    uploadHandler(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "File upload error: " + err.message
            });
        }

        try {
            const { category = 1, file_type = "ss", product_name = "23", price = 23, short_desc = "23", long_desc = "23", size = "23", link = "23", date } = req.body;

            const imgFile = req.files?.image ? req.files.image[0] : null;
            const fileFile = req.files?.file ? req.files.file[0] : null;

            let img_url = null;
            let file_url = null;

            if (imgFile) {
                img_url = `/files/uploads/${imgFile.filename}`;
            }

            if (fileFile) {
                const { chunkNumber, totalChunks, fileName } = req.body;

                if (!chunkNumber || !totalChunks || !fileName) {
                    return res.status(400).json({
                        success: false,
                        message: "Missing required chunk data."
                    });
                }

                const chunkDir = path.join(uploadPath, 'chunks', fileName);
                if (!fs.existsSync(chunkDir)) {
                    fs.mkdirSync(chunkDir, { recursive: true });
                }

                const chunkPath = path.join(chunkDir, `${chunkNumber}`);
                fs.writeFileSync(chunkPath, fileFile.buffer);

                let allChunksUploaded = true;
                for (let i = 1; i <= totalChunks; i++) {
                    if (!fs.existsSync(path.join(chunkDir, `${i}`))) {
                        allChunksUploaded = false;
                        break;
                    }
                }

                if (allChunksUploaded) {
                    const finalFilePath = path.join(uploadPath, fileName);

                    const fileStream = fs.createWriteStream(finalFilePath, { flags: 'a' });

                    for (let i = 1; i <= totalChunks; i++) {
                        const chunkContent = fs.readFileSync(path.join(chunkDir, `${i}`));
                        fileStream.write(chunkContent); 
                    }

                    fs.rmdirSync(chunkDir, { recursive: true }); 

                    file_url = `/files/uploads/${fileName}`;

                    const query = `
                        INSERT INTO products (user, category, file_type, product_name, price, short_desc, long_desc, size, img_url, link, file, date) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const params = [req.user.id, category, file_type, product_name, price, short_desc, long_desc, size, img_url, link, file_url, new Date()];

                    const result = await executeQuery(query, params);

                    const insertUserProduct = "INSERT INTO user_products (`user`, `product`, `date`) VALUES (?, ?, ?)";
                    await executeQuery(insertUserProduct, [req.user.id, result.insertId, new Date()]);

                    return res.status(201).json({
                        success: true,
                        data: { img_url, file_url, productId: result.insertId },
                        message: "Files and product uploaded successfully."
                    });
                }
            }

            return res.status(201).json({
                success: true,
                data: "ss",
                message: "Files and product uploaded successfully."
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                data: [],
                message: "Server error occurred."
            });
        }
    });
};

module.exports = { INSERT_FILES_V2, uploadHandler };
