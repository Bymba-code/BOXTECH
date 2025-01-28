const multer = require('multer');
const path = require('path');
const { executeQuery } = require('../../../Database/test');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');  // Directory where files will be saved
    },
    filename: function (req, file, cb) {
        // Use a unique timestamp with the original file extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter to accept only image files (optional, you can add more types if needed)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize multer instance with configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

const INSERT_FILES_V2 = async (req, res) => {

    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                data: [],
                message: err.message,  
            });
        }

        try {
            const { category, productName, price, shortDesc, longDesc, size, fileType } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    data: [],
                    message: "Файл сонгогдоогүй байна",  
                });
            }

            const fileName = req.file.filename;
            const filePath = `/uploads/images/${fileName}`;  

            const query = `
                INSERT INTO products (
                    user, category, file_type, product_name, price, short_desc, long_desc, size, img_url, date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                req.user.id,
                category,
                fileType,
                productName,
                price,
                shortDesc,
                longDesc,
                size,
                filePath,
                new Date()
            ];

            const result = await executeQuery(query, values);

            const queryTwo = "INSERT INTO user_products (`user`, `product`, `date`) VALUES (?, ?, ?)";
            const date = new Date();
            date.setFullYear(date.getFullYear() + 3);  // Example: set expiry date for the product

            await executeQuery(queryTwo, [req.user.id, result.insertId, date]);

            // Return success response
            return res.status(201).json({
                success: true,
                data: result,
                message: "Файл амжилттай бүртгэгдлээ",  
            });
        } catch (err) {
            console.error("INSERT_FILES_V2 Error:", err);
            return res.status(500).json({
                success: false,
                data: [],
                message: "Серверийн алдаа гарлаа",  // "Server error"
            });
        }
    });
};

module.exports = { INSERT_FILES_V2 };
