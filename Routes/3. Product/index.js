const express = require("express")
const GET_ALL_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/1. GET_ALL")
const GET_SINGLE_CATEGORY = require("../../Controllers/2. CATEGORY_CONTROLLER/2. GET_SINGLE")
const GET_SINGLE_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/2. GET_SINGLE")
const INSERT_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/4. INSERT")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const UPDATE_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/3. UPDATE")
const DELETE_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/5. DELETE")
const GET_USER_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/6. USER")
const multer = require("multer");
const INSERT_REVIEWS = require("../../Controllers/3. PRODUCT_CONTROLLER/7. REVIEWS")
const SEARCH_PRODUCTS = require("../../Controllers/3. PRODUCT_CONTROLLER/8. SEARCH")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");  
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });
  const upload = multer({ storage: storage }).single("img");  
  
const router = express.Router()

router.route("/product")
.get(GET_ALL_PRODUCT)
.post(Authenticate, Authorize(["user", "admin"]) , INSERT_PRODUCT)
.put(Authenticate, Authorize(["user", "admin"]), UPDATE_PRODUCT)
.delete(Authenticate, Authorize(["user", "admin"]), DELETE_PRODUCT)

router.route("/product/:productId").get(GET_SINGLE_PRODUCT)

router.route("/user/product").get(Authenticate, Authorize(["user", "admin"]), GET_USER_PRODUCT)

router.route("/reviews/product/:id").get(INSERT_REVIEWS)

router.route("/product/search/:category/:search").get(SEARCH_PRODUCTS)

module.exports = router
