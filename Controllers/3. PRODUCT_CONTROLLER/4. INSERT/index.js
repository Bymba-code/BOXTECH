const { executeQuery } = require("../../../Database/test");
const multer = require("multer");

// Configure the disk storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the "uploads" folder exists or create it at runtime
        const fs = require('fs');
        const path = 'uploads/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        cb(null, path);  // Path where files should be uploaded
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;  // Give a unique filename
        cb(null, fileName);
    }
});

// Initialize multer for file uploads
const upload = multer({ storage: storage });

// The product insertion handler, including file upload
const INSERT_PRODUCT = async (req, res) => {
    // Ensure to handle file upload via the 'img' field name in frontend
    upload.single('img')(req, res, async (err) => {  
        if (err) {
            return res.status(500).json({
                success: false,
                message: "File upload error: " + err.message
            });
        }

        try {
            const { category, file_type, productName, price, short_desc, long_desc, size, link } = req.body;
            const img = req.file ? req.file.filename : null;  // Retrieve the uploaded image filename

            // Check if the user is authorized to upload
            if (!req.user || req.user.role === "user") {
                const checkPermission = "SELECT * FROM user_subscription WHERE user = ?";
                const permission = await executeQuery(checkPermission, [req.user.id]);

                if (permission.length === 0) {
                    return res.status(403).json({
                        success: false,
                        message: "No subscription data found."
                    });
                }

                const userPermission = permission[0];
                const today = new Date();
                const endDate = new Date(userPermission.end_date);

                if (today >= endDate) {
                    return res.status(405).json({
                        success: false,
                        message: "Your file upload permission has expired."
                    });
                }
            }

            // Insert product details into the database
            const values = [
                req.user.id,
                category,
                file_type,
                productName,
                price,
                short_desc,
                long_desc,
                size,
                img,  // Store the image filename in the DB
                link,
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

            return res.status(200).json({
                success: true,
                data: data,
                message: "File successfully uploaded and product created."
            });
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
