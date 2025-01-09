const express = require("express")
const PROFILE_HOME = require("../../Controllers/13. PROFILE_CONTROLLER/1. HOME")
const Authenticate = require("../../Middlewares/Authenticate")

const router = express.Router()


router.route("/profile").get(Authenticate, PROFILE_HOME)

module.exports = router