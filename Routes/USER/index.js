const express = require("express")
const userInformation = require("../../Controller/USER/1. USER_INFORMATION")


const router = express.Router()

router.route("/user/:id")
.get(userInformation)


module.exports = router

