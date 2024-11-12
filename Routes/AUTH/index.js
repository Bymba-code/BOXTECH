const express = require("express")
const REGISTER = require("../../Controller/AUTH/REGISTER")
const LOGIN = require("../../Controller/AUTH/LOGIN")

const router = express.Router()

router.route("/auth/v1/register").post(REGISTER)

router.route("/auth/v1/login").post(LOGIN)

module.exports = router