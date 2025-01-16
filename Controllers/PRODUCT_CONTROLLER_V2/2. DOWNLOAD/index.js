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
