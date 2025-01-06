const { executeQuery } = require("../../../Database/test");
const multer = require("multer");

// Storage configuration for Multer
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

// Set up Multer upload
const upload = multer({ storage: storage });

const INSERT_NEWS = async (req, res) => {
    // Handling file upload before proceeding with the logic
    upload.single('img')(req, res, async (err) => {
        if (err) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Зургийг нэмхэд алдаа гарлаа"
            });
        }

        try {
            // Extract fields from request
            const { title, category, description, date } = req.body;
            const img = req.file ? req.file.filename : null; // File name from Multer

            // Validation checks
            if (!img) {
                return res.status(403).json({
                    success: false,
                    data: [],
                    message: "Мэдээний зургийг оруулна уу"
                });
            }

            if (!title) {
                return res.status(403).json({
                    success: false,
                    data: [],
                    message: "Мэдээний гарчигийг оруулна уу"
                });
            }

            if (!category) {
                return res.status(403).json({
                    success: false,
                    data: [],
                    message: "Мэдээний ангилалыг сонгоно уу"
                });
            }

            if (!description) {
                return res.status(403).json({
                    success: false,
                    data: [],
                    message: "Мэдээний тайлбарыг оруулна уу"
                });
            }

            // Prepare SQL query to insert the news
            const insertQuery = "INSERT INTO news (`img_url`, `title`, `category`, `description`, `date`) VALUES (?, ?, ?, ?, ?)";
            const data = await executeQuery(insertQuery, [img, title, category, description, new Date()]);

            // Check if insertion was successful
            if (data.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: "Мэдээг нэмхэд ямар нэгэн алдаа гарлаа"
                });
            }

            // Respond with success
            return res.status(200).json({
                success: true, // Change to true since it's a successful operation
                data: data,
                message: "Амжилттай"
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                data: [],
                message: `Серверийн алдаа: ${err.message}` // Added `err.message` for more info on error
            });
        }
    });
};

module.exports = INSERT_NEWS;
