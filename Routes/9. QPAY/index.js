const express = require("express")
const QPAY_TOKEN = require("../../Controllers/9. QPAY_CONTROLLER/1. TOKEN")

const router = express.Router()

router.route("/qpay/token").get(QPAY_TOKEN)

module.exports = router