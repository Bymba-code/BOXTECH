const express = require("express")
const GET_ALL_PRODUCT_CHECKOUT = require("../../Controllers/6. PRODUCT_CHECKOUT_CONTROLLER/1. GET_ALL")
const GET_SINGLE_PRODUCT_CHECKOUT = require("../../Controllers/6. PRODUCT_CHECKOUT_CONTROLLER/2. GET_SINGLE")
const GET_SINGLE_PRODUCT_CHECKOUT_USER = require("../../Controllers/6. PRODUCT_CHECKOUT_CONTROLLER/3. GET_USERS")
const Authorize = require("../../Middlewares/Authorization")
const Authenticate = require("../../Middlewares/Authenticate")
const CREATE_CHECKOUT = require("../../Controllers/6. PRODUCT_CHECKOUT_CONTROLLER/4. CREATE_PRODUCT_CHECKOUT")
const CREATE_CHECKOUT_INVOICE = require("../../Controllers/6. PRODUCT_CHECKOUT_CONTROLLER/5. CREATE_INVOICE_PRODUCT")
const CHECK_PRODUCT_INVOICE = require("../../Controllers/6. PRODUCT_CHECKOUT_CONTROLLER/6. CHECK_PRODUCT_INVOICE")

const router = express.Router()

router.route("/checkout/product")
.get(GET_ALL_PRODUCT_CHECKOUT)
.post(Authenticate, Authorize(["admin", "user"]), CREATE_CHECKOUT)

router.route("/checkout/product/:checkoutID")
.get(GET_SINGLE_PRODUCT_CHECKOUT)


router.route("/checkout/product/:checkoutID/invoice")
.get(Authenticate, Authorize(["admin", "user"]), CREATE_CHECKOUT_INVOICE)

router.route("/checkout/product/:checkoutID/invoice/check/:invoice")
.get(Authenticate, Authorize(["admin", "user"]) , CHECK_PRODUCT_INVOICE)

router.route("/checkout/user/product")
.get(Authenticate ,Authorize(["admin", "user"]) ,GET_SINGLE_PRODUCT_CHECKOUT_USER)

module.exports = router