const { executeQuery } = require("../../../DATABASE/index");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

const POST_CREATE_PRODUCT = async (req, res) => {
  // Process the file upload
  upload.single('image')(req, res, async (err) => {
    if (err) {
      let errorMessage = '';
      if (err instanceof multer.MulterError) {
        errorMessage = err.message;  
      } else {
        errorMessage = 'File upload failed';  
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    try {
      // Extracting product details from req.body (text fields)
      const { user, product_name, short_desc, description, price, category} = req.body;

      // Check if all required fields are provided
    //   if (!product_name) {
    //     return res.status(403).json({
    //       success: false,
    //       data: null,
    //       message: "Өөрийн файлын нэрийг оруулна уу."
    //     });
    //   }
    //   if (!short_desc) {
    //     return res.status(403).json({
    //       success: false,
    //       data: null,
    //       message: "Богино тайлбарыг оруулна уу."
    //     });
    //   }
    //   if (!description) {
    //     return res.status(403).json({
    //       success: false,
    //       data: null,
    //       message: "Файлын тайлбарыг оруулна уу."
    //     });
    //   }
    //   if (!price) {
    //     return res.status(403).json({
    //       success: false,
    //       data: null,
    //       message: "Файлын зарагдах үнэ -ийг оруулна уу."
    //     });
    //   }

      // Check if the provided category exists in the database
      const categoryCheckQuery = "SELECT id FROM categories WHERE id = ?";
      const categoryData = await executeQuery(categoryCheckQuery, [2]);

      if (categoryData.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Тухайн категори байхгүй байна."
        });
      }

      // Get the uploaded image URL from req.file
      const imageUrl = req.file ? req.file.path : null;

      // Insert the product data into the database
      const values = [
        2, "Sdfsdfsf", "sdfsdfsdf", "sdsdsds", 23, imageUrl, new Date(), 2
      ];

      const query = "INSERT INTO products (`user`, `product_name`, `short_desc`, `desc`, `price`, `img_url`, `create_date`, `category`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const data = await executeQuery(query, values);

      if (data) {
        return res.status(200).json({
          success: true,
          data: data,
          message: "Таны файлыг амжилттай нэмлээ."
        });
      }

    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        data: null,
        message: "Серверийн алдаа",
        error: err.message || err
      });
    }
  });
};

module.exports = POST_CREATE_PRODUCT;
