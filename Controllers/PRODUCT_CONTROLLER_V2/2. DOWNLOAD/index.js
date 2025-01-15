const {executeQuery} = require("../../../Database/test")
const path = require('path');
const fs = require('fs');

const downloadFile = async (req, res) => {
    try 
    {
        const { id } = req.params; 

        // 1. Файл мэдээлэл авах
        const queryOne = `SELECT * FROM products WHERE id = ?`
    
        const productDB = await executeQuery(queryOne, [id])
        const product = productDB[0]
    
        // 2. Файл татаж авах эрх шалгах
        const queryTwo = `SELECT * FROM user_products WHERE user = ? AND product = ? LIMIT 1`
    
        const userPermission = await executeQuery(queryTwo, [req.user.id , product.id]) 
        const permissionDate = userPermission[0]
    
        if(!permissionDate)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Та файлыг татаж авхын тулд худалдаж авна уу"
            })
        }
    
        const today = new Date()
    
        if(permissionDate.date <= today)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Файлыг татаж авах хугацаа дууссан байна."
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
