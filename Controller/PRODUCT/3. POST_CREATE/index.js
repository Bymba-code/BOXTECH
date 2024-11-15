const multer = require("multer");
const path = require("path");
const { executeQuery } = require("../../../DATABASE/index");

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save uploaded files to the 'uploads' directory
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // Create a unique filename for each uploaded image
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const POST_CREATE_PRODUCT = async (req, res) => {
    try {
        // Handling file upload
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "File upload error",
                    error: err.message
                });
            }

            // Now we can access the image URL (path)
            const {
                username,
                productName,
                shortDesc,
                desc,
                price,
                link,
                categoryName
            } = req.body;

            const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

            const values = [
                username,
                productName,
                shortDesc,
                desc,
                price,
                link,
                categoryName,
                imagePath  // Image path to be saved in the DB
            ];

            // Validation checks (already present in your code)
            if (!username) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Нэвтэрнэ үү"
                });
            }
            if (!productName) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Өөрийн файлын нэрийг оруулна уу."
                });
            }
            if (!shortDesc) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Богино тайлбарыг оруулна уу."
                });
            }
            if (!desc) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Файлын тайлбарыг оруулна уу."
                });
            }
            if (!price) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Файлын зарагдах үнэ -ийг оруулна уу."
                });
            }
            if (!link) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Файлын татах линкийг оруулна уу."
                });
            }
            if (!categoryName) {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "Файлын төрлийг сонгоно уу"
                });
            }

            const query =
                "INSERT INTO products (`username`, `product_name`, `short_desc`, `description`, `price`, `link`, `category_name`, `imgUrl`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            const data = await executeQuery(query, values);

            if (data) {
                return res.status(200).json({
                    success: true,
                    data: data,
                    message: "Таны файлыг амжилттай нэмлээ."
                });
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
            error: err.message || err
        });
    }
};

module.exports = POST_CREATE_PRODUCT;
