const { executeQuery } = require("../../../Database/test");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fs = require('fs');
        const path = 'uploads/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path); 
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`; 
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

const INSERT_PRODUCT = async (req, res) => {
    upload.single('img')(req, res, async (err) => {  
        if (err) {
            return res.status(500).json({
                success: false,
                message: "File upload error: " + err.message
            });
        }

        try {
            const { category, file_type, productName, price, short_desc, long_desc, size, link } = req.body;
            const img = req.file ? req.file.filename : null;  


            let domain = link.replace(/^(https?:\/\/)?(www\.)?/, ""); 
            domain = domain.split("/")[0]; 
            

            if (!req.user || req.user.role === "user") {
                const checkPermission = "SELECT * FROM user_subscription WHERE user = ?";
                const permission = await executeQuery(checkPermission, [req.user.id]);

            if (permission.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "Сунгалтын өгөгдөл олдсонгүй."
                });
            }

            const userPermission = permission[0];
            const today = new Date();
            const endDate = new Date(userPermission.end_date);

            if (today >= endDate) {
                return res.status(405).json({
                    success: false,
                    message: "Таны файл байршуулах эрх дууссан байна."
                });
            }
            }

            const values = [
                req.user.id,
                category,
                file_type,
                productName,
                price,
                short_desc,
                long_desc,
                size,
                img,  
                domain,
                new Date()
            ];

            const query = `
                INSERT INTO products 
                (\`user\`, \`category\`, \`file_type\`, \`product_name\`, \`price\`, \`short_desc\`, \`long_desc\`, \`size\`, \`img_url\`, \`link\`, \`date\`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const data = await executeQuery(query, values);

            if (data.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Error uploading the product data."
                });
            }

            const insertUserProduct = "INSERT INTO user_products (`user`,`product`,`date`) VALUES (? , ? , ?)"
            const insertData = await executeQuery(insertUserProduct , [req.user.id, data.insertId, new Date()])

            if(insertData.affectedRows > 0)
            {
                return res.status(200).json({
                    success: true,
                    data: data,
                    message: "File successfully uploaded and product created."
                });
            }


            
        } catch (err) {
            console.error(err);  
            return res.status(500).json({
                success: false,
                message: "Server error: " + err.message
            });
        }
    });
};

module.exports = INSERT_PRODUCT;
