const express = require("express")
const authenticateToken = require("../../Middlewares/Authenticate")
const GET_ALL_SUB = require("../../Controller/6. SUBSCRIPTION_CONTROLLER/1. GET_ALL")
const authorizeRoles = require("../../Middlewares/Authorization")
const GET_SINGLE_SUB = require("../../Controller/6. SUBSCRIPTION_CONTROLLER/2. GET_SINGLE")
const UPDATE_SUB = require("../../Controller/6. SUBSCRIPTION_CONTROLLER/3.UPDATE_SINGLE")

const router = express.Router()

router.route("/user/subscription").get(authenticateToken, authorizeRoles("admin"), GET_ALL_SUB)

router.route("/user/subscription/:id").get(authenticateToken, authorizeRoles("user" , "admin"), GET_SINGLE_SUB)

router.route("/user/subscription/update").post(authenticateToken, authorizeRoles("user", "admin") , UPDATE_SUB)

module.exports = router