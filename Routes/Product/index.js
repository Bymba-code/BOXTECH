const express = require("express")
const GET_ALL_PRODUCT = require("../../Controller/1. PRODUCT_CONTROLLER/1. GET_ALL")
const GET_ALL_BY_CATEGORY_PRODUCT = require("../../Controller/1. PRODUCT_CONTROLLER/2. GET_BY_CATEGORY")
const GET_SINGLE_PRODUCT = require("../../Controller/1. PRODUCT_CONTROLLER/3. GET_SINGLE")
const POST_CREATE_PRODUCT = require("../../Controller/1. PRODUCT_CONTROLLER/4. CREATE_PRODUCT")
const GET_USER_PRODUCT = require("../../Controller/8. USER_PRODUCT_CONTROLLER/1. GET_ALL")

const router = express.Router()

router.route("/product").get(GET_ALL_PRODUCT)
.post(POST_CREATE_PRODUCT)

router.route("/product/:category").get(GET_ALL_BY_CATEGORY_PRODUCT)

router.route("/product/single/:id").get(GET_SINGLE_PRODUCT)

router.route("/product/user/:id").get(GET_USER_PRODUCT)

module.exports = router
