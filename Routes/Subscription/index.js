const express = require("express")
const authenticateToken = require("../../Middlewares/Authenticate")
const GET_ALL_SUB = require("../../Controller/6. SUBSCRIPTION_CONTROLLER/1. GET_ALL")
const authorizeRoles = require("../../Middlewares/Authorization")
const GET_SINGLE_SUB = require("../../Controller/6. SUBSCRIPTION_CONTROLLER/2. GET_SINGLE")
const UPDATE_SUB = require("../../Controller/6. SUBSCRIPTION_CONTROLLER/3.UPDATE_SINGLE")

const router = express.Router()

router.route("/user/subscription").get(GET_ALL_SUB)

router.route("/user/subscription/:id").get(GET_SINGLE_SUB)

router.route("/user/subscription/update").post(UPDATE_SUB)

module.exports = router
