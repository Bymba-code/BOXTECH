const express = require("express")
const GATEWAY_TOKEN = require("../../Controllers/8. GATEWAY_CONTROLLER/1. TOKEN")

const router = express.Router()

router.route("/gateway/token").get(GATEWAY_TOKEN)

module.exports = router