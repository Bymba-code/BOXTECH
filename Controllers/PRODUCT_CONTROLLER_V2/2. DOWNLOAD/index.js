const { executeQuery } = require("../../../Database/test");
const path = require('path');
const fs = require('fs');

const downloadFile = async (req, res) => {
    try {
        const { id } = req.params; 


        const queryOne = `SELECT * FROM products WHERE id = ?`;
        const productDB = await executeQuery(queryOne, [id]);
        const product = productDB[0];

        const queryTwo = `SELECT * FROM user_products WHERE user = ? AND product = ? LIMIT 1`;
        const userPermission = await executeQuery(queryTwo, [req.user.id, product.id]);
        const permissionDate = userPermission[0];

        if (!permissionDate) {
            return res.status(402).json({
                success: false,
                data: [],
                message: "Та файлыг худалдаж авна уу."
            });
        }

        const today = new Date();

        if (permissionDate.date <= today) {
            return res.status(403).json({
                success: false,
                data: [],
                message: "Таны файлыг татаж авах хугацаа дууссан байна."
            });
        }
        else 
        {
            
        const filePath = path.join(__dirname, '../../../uploads/files', product.file.split("/")[3]);
        const fileName = product.file.split("/").pop(); 


        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/octet-stream');  

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            
            
        } else {
            return res.status(404).json({
                success: false,
                message: 'File has expired or does not exist.'
            });
        }
        }
    } catch (err) {
        console.error(err);  
        return res.status(500).json({
            success: false,
            data: [],
            message: "A server error occurred."
        });
    }
};

module.exports = { downloadFile };
