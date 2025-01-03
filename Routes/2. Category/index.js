const express = require("express")
const GET_ALL_CATEGORY = require("../../Controllers/2. CATEGORY_CONTROLLER/1. GET_ALL")
const GET_SINGLE_CATEGORY = require("../../Controllers/2. CATEGORY_CONTROLLER/2. GET_SINGLE")
const UPDATE_CATEGORY = require("../../Controllers/2. CATEGORY_CONTROLLER/3. UPDATE")
const INSERT_CATEGORY = require("../../Controllers/2. CATEGORY_CONTROLLER/4. INSERT")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const DELETE_CATEGORY = require("../../Controllers/2. CATEGORY_CONTROLLER/5. DELETE")

const router = express.Router()

router.route("/category")
.get(GET_ALL_CATEGORY)
.post(Authenticate, Authorize("admin"), INSERT_CATEGORY)
.put(Authenticate,  Authorize("admin"), UPDATE_CATEGORY)
.delete(Authenticate, Authorize("admin"), DELETE_CATEGORY)

router.route("/category/:categoryId")
.get(GET_SINGLE_CATEGORY)

module.exports = router