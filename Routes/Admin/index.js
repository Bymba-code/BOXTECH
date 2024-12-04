const express = require("express")
const DASHBOARD_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/1. DASHBOARD")
const RECENT_ORDER = require("../../Controller/10. ADMIN_CONTROLLER/2. RECENT_PAYMENT")
const PRODUCT_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/3.PRODUCT")

const router = express.Router()

router.route("/admin/dashboard").get(DASHBOARD_ADMIN) 

router.route("/admin/recent").get(RECENT_ORDER)

router.route("/admin/products").get(PRODUCT_ADMIN)

module.exports = router