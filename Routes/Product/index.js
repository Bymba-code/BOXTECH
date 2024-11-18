const express = require("express")
const GET_ALL_PRODUCT = require("../../Controller/1. PRODUCT_CONTROLLER/1. GET_ALL")
const GET_ALL_BY_CATEGORY_PRODUCT = require("../../Controller/1. PRODUCT_CONTROLLER/2. GET_BY_CATEGORY")
const GET_SINGLE_PRODUCT = require("../../Controller/1. PRODUCT_CONTROLLER/3. GET_SINGLE")
const GET_ALL_COMMENT = require("../../Controller/4. PRODUCT_COMMENTS/1. GET_ALL_COMMENTS")

const router = express.Router()

router.route("/product").get(GET_ALL_PRODUCT)

router.route("/product/:category").get(GET_ALL_BY_CATEGORY_PRODUCT)

router.route("/product/single/:id").get(GET_SINGLE_PRODUCT)

module.exports = router