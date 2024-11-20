const express = require("express")
const GET_ALL_CATEGORY = require("../../Controller/2. CATEGORY_CONTROLLER/1. GET_ALL")

const router = express.Router()

router.route("/category").get(GET_ALL_CATEGORY)

module.exports = router
