const express = require("express")
const GET_ALL_CHECKOUT = require("../../Controller/7. CHECKOUT_CONTROLLER/1. GET_ALL")
const GET_USER_CHECKOUT = require("../../Controller/7. CHECKOUT_CONTROLLER/2. GET_USERS_CHECKOUT")
const CREATE_CHECKOUT = require("../../Controller/7. CHECKOUT_CONTROLLER/3. CREATE_CHECKOUT")

const router = express.Router()

router.route("/checkout")
.get(GET_ALL_CHECKOUT)
.post(CREATE_CHECKOUT)

router.route("/checkout/:id").get(GET_USER_CHECKOUT)


module.exports = router
