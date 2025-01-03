const express = require("express")
const GET_ALL_EXPAND = require("../../Controllers/5. EXPAND_CONTROLLER/1. GET_ALL_EXPAND")
const GET_SINGLE_EXPAND = require("../../Controllers/5. EXPAND_CONTROLLER/2. GET_SINGLE_EXPAND")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const CREATE_EXPAND = require("../../Controllers/5. EXPAND_CONTROLLER/3. CREATE_EXPAND")
const CREATE_EXPAND_INVOICE = require("../../Controllers/5. EXPAND_CONTROLLER/4. CREATE_EXPAND_INVOICE")
const CHECK_EXPAND_INVOICE = require("../../Controllers/5. EXPAND_CONTROLLER/6. CHECK_EXPAND_INVOICE")
const GET_BYID_EXPAND = require("../../Controllers/5. EXPAND_CONTROLLER/7. GET_SINGLE")

const router = express.Router()

router.route("/expand")
.get(Authenticate,Authorize(["user"]),GET_ALL_EXPAND)
.post(Authenticate, Authorize(["user", "admin"]), CREATE_EXPAND)

router.route("/expand/:user")
.get(Authenticate, Authorize(["user", "admin"]), GET_SINGLE_EXPAND)

router.route("/expand/invoice/:checkoutId")
.get(Authenticate, Authorize(["admin", "user"]), CREATE_EXPAND_INVOICE)

router.route("/expand/invoice/:checkoutId/check/:invoice")
.get(Authenticate, Authorize(["admin", "user"]) , CHECK_EXPAND_INVOICE)

router.route("/expand/single/:id")
.get(Authenticate, Authorize(["user"]), GET_BYID_EXPAND)


module.exports = router