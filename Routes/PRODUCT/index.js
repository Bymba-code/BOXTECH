const express = require("express")
const GET_ALL_PRODUCT = require("../../Controller/PRODUCT/1. GET_ALL")
const GET_SINGLE_PRODUCT = require("../../Controller/PRODUCT/2. GET_SINGLE")
const POST_CREATE_PRODUCT = require("../../Controller/PRODUCT/3. POST_CREATE")
const GET_PRODUCTS_USERNAME = require("../../Controller/PRODUCT/4. GET_USER_PRODUCT")
const GET_BY_CATEGORY = require("../../Controller/PRODUCT/5. GET_BY_CATEGORY")

const router = express.Router()

router.route("/product")
.get(GET_ALL_PRODUCT)
.post(POST_CREATE_PRODUCT)

router.route("/product/:id")
.get(GET_SINGLE_PRODUCT)

router.route("/product/category/:categoryName")
.get(GET_BY_CATEGORY)

router.route("/product/:username/contents")
.get(GET_PRODUCTS_USERNAME)

module.exports = router
