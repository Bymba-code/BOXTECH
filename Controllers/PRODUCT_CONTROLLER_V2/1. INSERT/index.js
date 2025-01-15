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
        fileSize: 30 * 1024 * 1024 * 1024 
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
])

const INSERT_FILES_V2 = async (req, res) => {
    uploadHandler(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "File upload error: " + err.message
            });
        }

        const queryOne = "SELECT * FROM user_subscription WHERE user = ?"
        const permissionDB = await executeQuery(queryOne, [req.user.id])
        const permission = permissionDB[0]
        const date = new Date()

        if(permission.end_date < date)
        {
            return res.status(402).json({
                success:false,
                data: [],
                message: "Таны файл байршуулах эрх дууссан байна."
            })
        }

        try {
            const { category ,file_type, product_name , price , short_desc , long_desc , size} = req.body;

            const imgFile = req.files?.image ? req.files.image[0] : null;
            const fileFile = req.files?.file ? req.files.file[0] : null;



            let img_url = null;
            let file_url = null;


            


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
                    const fileStream = fs.createWriteStream(finalFilePath);


                    for (let i = 1; i <= totalChunks; i++) {
                        const chunkContent = fs.readFileSync(path.join(chunkDir, `${i}`));
                        fileStream.write(chunkContent);
                    }

                    fileStream.end();
                    fs.rmdirSync(chunkDir, { recursive: true });

                    file_url = `/files/uploads/${fileName}`;

                    if (imgFile) {
                        const imgDir = path.join(uploadPath, "images");
                        if (!fs.existsSync(imgDir)) {
                            fs.mkdirSync(imgDir, { recursive: true });
                        }
                        const imgPath = path.join(imgDir, `${Date.now()}_${imgFile.originalname}`);
                        fs.writeFileSync(imgPath, imgFile.buffer);
                        img_url = `/files/images/${path.basename(imgPath)}`;
                    }
        

                    const query = `
                    INSERT INTO products (user,category, file_type, product_name, price, short_desc, long_desc, size, img_url, file, date) 
                    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const params = [req.user.id ,category, file_type, product_name, price, short_desc, long_desc, size, img_url ,file_url, new Date()];

                    console.log(req.user.id ,category, file_type, product_name, price, short_desc, long_desc, size, img_url ,file_url, new Date())

                    const result = await executeQuery(query, params);

                    return res.status(201).json({
                        success: true,
                        data: { img_url, file_url, productId: result.insertId },
                        message: "Файлыг амжилттай байршуулж дууслаа."
                    });

                }
                
            }



            return res.status(201).json({
                success: true,
                data:"ss",
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
