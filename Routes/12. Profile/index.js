const express = require("express")
const PROFILE_HOME = require("../../Controllers/13. PROFILE_CONTROLLER/1. HOME")
const Authenticate = require("../../Middlewares/Authenticate")
const PROFILE_HOME_DETAIL = require("../../Controllers/13. PROFILE_CONTROLLER/2. PROFILE")

const router = express.Router()


router.route("/profile").get(Authenticate, PROFILE_HOME)

router.route("/profile/home").get(Authenticate, PROFILE_HOME_DETAIL)

module.exports = router
