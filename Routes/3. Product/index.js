const express = require("express")
const GET_ALL_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/1. GET_ALL")
const GET_SINGLE_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/2. GET_SINGLE")
const INSERT_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/4. INSERT")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const UPDATE_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/3. UPDATE")
const DELETE_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/5. DELETE")
const GET_USER_PRODUCT = require("../../Controllers/3. PRODUCT_CONTROLLER/6. USER")
const INSERT_REVIEWS = require("../../Controllers/3. PRODUCT_CONTROLLER/7. REVIEWS")
const SEARCH_PRODUCTS = require("../../Controllers/3. PRODUCT_CONTROLLER/8. SEARCH")
const {INSERT_FILES_V2} = require("../../Controllers/PRODUCT_CONTROLLER_V2/1. INSERT")
const { downloadFile } = require("../../Controllers/PRODUCT_CONTROLLER_V2/2. DOWNLOAD")



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

router.route("/product/v2").post(Authenticate, INSERT_FILES_V2);

router.route("/product/v2/:id/:token").get(downloadFile)

module.exports = router
