const express = require("express")
const GET_ALL_CATEGORY = require("../../Controller/2. CATEGORY_CONTROLLER/1. GET_ALL")
const GET_SINGE_CATEGORY = require("../../Controller/2. CATEGORY_CONTROLLER/2. GET_SINGLE")
const DELETE_CATEGORY = require("../../Controller/2. CATEGORY_CONTROLLER/3.DELELE")
const UPDATE_CATEGORY = require("../../Controller/2. CATEGORY_CONTROLLER/4. UPDATE")
const CREATE_CATEGORY = require("../../Controller/2. CATEGORY_CONTROLLER/5. CREATE")

const router = express.Router()

router.route("/category").get(GET_ALL_CATEGORY).post(UPDATE_CATEGORY)

router.route("/category/:id").get(GET_SINGE_CATEGORY).delete(DELETE_CATEGORY)

router.route("/create/category").post(CREATE_CATEGORY)

module.exports = router
