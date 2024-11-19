const express = require("express")
const GET_ALL_CHECKOUT = require("../../Controller/7. CHECKOUT_CONTROLLER/1. GET_ALL")
const authenticateToken = require("../../Middlewares/Authenticate")
const authorizeRoles = require("../../Middlewares/Authorization")
const GET_USER_CHECKOUT = require("../../Controller/7. CHECKOUT_CONTROLLER/2. GET_USERS_CHECKOUT")
const CREATE_CHECKOUT = require("../../Controller/7. CHECKOUT_CONTROLLER/3. CREATE_CHECKOUT")

const router = express.Router()

router.route("/checkout")
.get(authenticateToken, authorizeRoles("admin") ,GET_ALL_CHECKOUT)
.post(authenticateToken, authorizeRoles("admin", "user"), CREATE_CHECKOUT)

router.route("/checkout/:id").get(authenticateToken, authorizeRoles("user", "admin"), GET_USER_CHECKOUT)


module.exports = router