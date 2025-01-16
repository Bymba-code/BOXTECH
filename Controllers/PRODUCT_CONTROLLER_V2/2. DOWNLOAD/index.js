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

        if(dataTwo.length === 0)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Файлыг худалдаж авна уу"
            })
        }

        const date = new Date()

        if(dataTwo[0].date < date)
        {
            return res.status(401).json({
                success:false,
                data:[],
                message: "Файлыг татаж авах хугацаа дууссан байна. Та дахин худалдан авснаар татаж авах боломжтой"
            })
        }


        const filePath = path.join(__dirname, '../../../uploads/files', product.file.split("/")[3]);
    
        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
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
