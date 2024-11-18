const express = require("express")
const AUTH_LOGIN = require("../../Controller/3. AUTH_CONTROLLER/1. LOGIN")
const AUTH_REGISTER = require("../../Controller/3. AUTH_CONTROLLER/2. REGISTER")

const router = express.Router()

router.route("/login")
.post(AUTH_LOGIN)

router.route("/register")
.post(AUTH_REGISTER)

module.exports = router