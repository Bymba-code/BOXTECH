const fs = require("fs");
const path = require("path");
const { executeQuery } = require('../../../Database/test');

const TEMP_DIR = path.join(__dirname, "../../../uploads/chunks"); 
const FINAL_DIR = path.join(__dirname, "../../../uploads/files"); 

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

        // Chunk файлаас түр хадгалах газар
        const chunkFilePath = path.join(TEMP_DIR, `${fileName}.chunk_${chunkIndex}`);
        fs.writeFileSync(chunkFilePath, chunk.buffer);

        console.log(`Chunk ${chunkIndex} of ${fileName} uploaded successfully.`);

        // Бүх чанкууд ирсэн эсэхийг шалгах
        const allChunksUploaded = Array.from({ length: totalChunks }).every((_, i) =>
            fs.existsSync(path.join(TEMP_DIR, `${fileName}.chunk_${i}`))
        );

        if (allChunksUploaded) {
            // Эцсийн файл үүсгэх
            const finalFilePath = path.join(FINAL_DIR, fileName);
            const writeStream = fs.createWriteStream(finalFilePath);

            // Чанкуудыг нэгтгэн үүсгэх
            for (let i = 0; i < totalChunks; i++) {
                const chunkPath = path.join(TEMP_DIR, `${fileName}.chunk_${i}`);
                const data = fs.readFileSync(chunkPath);
                writeStream.write(data);
                fs.unlinkSync(chunkPath); // Chunk-ийг хасах
            }

            writeStream.end();
            console.log(`File ${fileName} assembled successfully.`);

            // Файл үүслээ бол MySQL руу замыг оруулах
            const filePath = path.join("uploads/files", fileName); // Дата санруу оруулах файлын зам
            const query = "INSERT INTO product_files (`product`, `file`) VALUES (?, ?)";
            const values = [productId, filePath];

            try {
                await executeQuery(query, values); // query гүйцэтгэж DB-д файл хүснэгт оруулах
                console.log("Файл амжилттай өгөгдлийн санд хадгалагдлаа.");
            } catch (dbError) {
                console.error("DB хадгалалт амжилтгүй:", dbError);
                return res.status(500).json({
                    success: false,
                    message: "Өгөгдлийн сан руу хадгалж чадсангүй.",
                });
            }

            return res.status(200).json({
                success: true,
                message: `Файл (${fileName}) амжилттай байршлаа.`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Файлын ${chunkIndex}-р хэсгийг амжилттай хүлээн авлаа.`,
        });
    } catch (err) {
        console.error("INSERT_CHUNKS Error:", err);
        return res.status(500).json({
            success: false,
            message: "Серверийн алдаа гарлаа.",
        });
    }
};

module.exports = { INSERT_CHUNKS };
