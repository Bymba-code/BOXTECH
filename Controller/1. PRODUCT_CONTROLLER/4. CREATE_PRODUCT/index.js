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
      const { user, productName, shortDesc, desc, price, category, link} = req.body;

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

      const categoryCheckQuery = "SELECT id FROM categories WHERE id = ?";
      const categoryData = await executeQuery(categoryCheckQuery, [2]);

      if (categoryData.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Тухайн категори байхгүй байна."
        });
      }

      const imageUrl = req.file ? req.file.path : null;

      const values = [
       user,  productName, shortDesc, desc, price, imageUrl, new Date(), category, link
      ];

      const query = "INSERT INTO products (`user`, `product_name`, `short_desc`, `desc`, `price`, `img_url`, `create_date`, `category`, `link`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
