const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const { executeQuery } = require('../../../Database/test');

const TEMP_DIR = path.join(__dirname, "../../../uploads/chunks");
const FINAL_DIR = path.join(__dirname, "../../../uploads/files");

// Ensure directories exist
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });

const INSERT_CHUNKS = async (req, res) => {
    try {
        const { fileName, chunkIndex, totalChunks, productId } = req.body;
        const chunk = req.file;

        if (!fileName || chunkIndex === undefined || !totalChunks || !chunk || !productId) {
            return res.status(400).json({
                success: false,
                message: "Алдаатай хүсэлт. Шаардлагатай мэдээлэл байхгүй байна.",
            });
        }

        const chunkFilePath = path.join(TEMP_DIR, `${fileName}.chunk_${chunkIndex}`);
        
        try {
            fs.writeFileSync(chunkFilePath, chunk.buffer);
        } catch (writeError) {
            console.error('Chunk Write Error:', writeError);
            return res.status(500).json({
                success: false,
                message: "Файл хадгалахад алдаа гарлаа.",
            });
        }

        const allChunksUploaded = Array.from({ length: totalChunks }).every((_, index) =>
            fs.existsSync(path.join(TEMP_DIR, `${fileName}.chunk_${index}`))
        );

        if (allChunksUploaded) {
            const finalFilePath = path.join(FINAL_DIR, fileName);

            try {
                // Increase max listeners
                const writeStream = fs.createWriteStream(finalFilePath);
                writeStream.setMaxListeners(0);

                // Async chunk assembly
                const assembleChunks = async () => {
                    for (let index = 0; index < totalChunks; index++) {
                        const chunkPath = path.join(TEMP_DIR, `${fileName}.chunk_${index}`);
                        const readStream = fs.createReadStream(chunkPath);

                        await pipeline(
                            readStream, 
                            writeStream, 
                            { end: index === totalChunks - 1 }
                        );

                        fs.unlinkSync(chunkPath);
                    }
                };

                await assembleChunks();

                // Database insertion
                const filePath = path.join("uploads/files", fileName);
                const query = "INSERT INTO product_files (`product`, `file`) VALUES (?, ?)";
                const values = [173, filePath];

                await executeQuery(query, values);

                return res.status(200).json({
                    success: true,
                    message: `Файл (${fileName}) амжилттай байршлаа.`,
                });

            } catch (assemblyError) {
                console.error('File Assembly Error:', assemblyError);
                return res.status(500).json({
                    success: false,
                    message: "Файл үүсгэхэд алдаа гарлаа.",
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Файлын ${chunkIndex}-р хэсгийг амжилттай хүлээн авлаа.`,
        });

    } catch (err) {
        console.error("INSERT_CHUNKS Unhandled Error:", err);
        return res.status(500).json({
            success: false,
            message: "Серверийн алдаа гарлаа.",
        });
    }
};

module.exports = { INSERT_CHUNKS };
