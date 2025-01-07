const express = require("express")
const GET_COMMENT = require("../../Controllers/10. PRODUCT_COMMENT_CONTROLLER/1. GET")
const CREATE_COMMENT = require("../../Controllers/10. PRODUCT_COMMENT_CONTROLLER/2. INSERT")
const Authenticate = require("../../Middlewares/Authenticate")
const DELETE_COMMENT = require("../../Controllers/10. PRODUCT_COMMENT_CONTROLLER/3. DELETE")

const router = express.Router()

router.route("/comment").post(Authenticate, CREATE_COMMENT).delete(Authenticate, DELETE_COMMENT)


router.route("/comments/:id").get(GET_COMMENT)


module.exports = router
