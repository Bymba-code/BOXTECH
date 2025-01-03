const express = require("express")
const REGISTER = require("../../Controllers/1. AUTH_CONTROLLER/1. REGISTER")
const LOGIN = require("../../Controllers/1. AUTH_CONTROLLER/2. LOGIN")
const Authenticate = require("../../Middlewares/Authenticate")
const TOKEN_REFRESH = require("../../Controllers/1. AUTH_CONTROLLER/3. TOKEN_REFRESH")

const router = express.Router()


router.route("/register").post(REGISTER)

router.route("/login").post(LOGIN)

router.route("/token").get(Authenticate, TOKEN_REFRESH)

module.exports = router