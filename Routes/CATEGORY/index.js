const express = require("express")
const GET_ALL_CATEGORY = require("../../Controller/CATEGORY/1. GET_ALL")
const GET_SINGLE_CATEGORY = require("../../Controller/CATEGORY/2. GET_SINGLE")
const POST_CREATE_CATEGORY = require("../../Controller/CATEGORY/3. POST_CREATE")
const DELETE_CATEGORY = require("../../Controller/CATEGORY/4. DELETE_CATEGORY")

const router = express.Router()



    router.route("/category")
.get(GET_ALL_CATEGORY)
.post(POST_CREATE_CATEGORY)
.delete(DELETE_CATEGORY)


router.route("/category/:name")
.get(GET_SINGLE_CATEGORY)




module.exports = router