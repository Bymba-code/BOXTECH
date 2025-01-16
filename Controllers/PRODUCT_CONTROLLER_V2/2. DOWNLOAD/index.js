const {executeQuery} = require("../../../Database/test")
const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken")
require("dotenv")

const downloadFile = async (req, res) => {
    try 
    {
        const { id, token } = req.params; 

        // 1. Файл мэдээлэл авах
        const queryOne = `SELECT * FROM products WHERE id = ?`
    
        const productDB = await executeQuery(queryOne, [id])
        const product = productDB[0]

        // 2. Токен задлах
        const accessToken = jwt.verify(token, process.env.TOKEN_SECRET)
        

        // 3. Файл татах эрхийг шалгах
        const queryTwo = "SELECT * FROM user_products WHERE user = ? and product = ?"
        const dataTwo = await executeQuery(queryTwo , [accessToken.id, id])

        if (dataTwo.length === 0) {
            // If the user hasn't purchased the file, return an HTML page informing them
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="mn">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Файл Худалдаж Авах</title>
                </head>
                <body>
                    <h1>Файлыг Худалдаж Авна Уу</h1>
                    <p>Та энэ файлыг татаж авахын тулд худалдаж авах хэрэгтэй.</p>
                    <a href="/boxtech/store">Файл худалдаж авах</a>
                </body>
                </html>
            `;
            return res.status(404).send(htmlContent);
        }

        const date = new Date();

        if (dataTwo[0].date < date) {
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="mn">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Файл Татаж Авах Хугацаа Дууссан</title>
                </head>
                <body>
                    <h1>Таны файлыг татаж авах хугацаа дууссан байна.</h1>
                    <p>Та дахин худалдан авсны дараа файлыг татаж авах боломжтой.</p>
                    <a href="/boxtech/store">Дахин Худалдаж Авах</a>
                </body>
                </html>
            `;
            return res.status(401).send(htmlContent);
        }


        
        const filePath = path.join(__dirname, '../../../uploads/files', product.file.split("/")[3]);
    
        if (fs.existsSync(filePath)) {
            res.status(200).download(filePath, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Татаж авах явцад ямар нэгэн алдаа гарлаа'
                    });
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Файл устарсан эсвэл байхгүй байна.'
            });
        }

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа"
        })
    }
};

module.exports = { downloadFile };
