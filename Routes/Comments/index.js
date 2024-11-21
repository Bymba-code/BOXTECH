const express = require("express")
const GET_ALL_COMMENT = require("../../Controller/4. PRODUCT_COMMENTS/1. GET_ALL_COMMENTS")
const GET_COMMENT_BY_PRODUCT = require("../../Controller/4. PRODUCT_COMMENTS/2. GET_BY_PRODUCT")
const POST_CREATE_COMMENT = require("../../Controller/4. PRODUCT_COMMENTS/3. POST_CREATE_COMMENT")
const DELETE_COMMENT = require("../../Controller/4. PRODUCT_COMMENTS/4. DELETE_COMMENT")
const authenticateToken = require("../../Middlewares/Authenticate")

const router = express.Router()

router.route("/comment")
.get(GET_ALL_COMMENT)
.post(POST_CREATE_COMMENT)
.delete(DELETE_COMMENT)

router.route("/comment/:product")
.get(GET_COMMENT_BY_PRODUCT)

module.exports = router
