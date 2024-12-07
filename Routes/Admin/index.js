const express = require("express")
const DASHBOARD_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/1. DASHBOARD")
const RECENT_ORDER = require("../../Controller/10. ADMIN_CONTROLLER/2. RECENT_PAYMENT")
const PRODUCT_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/3.PRODUCT")
const authenticateToken = require("../../Middlewares/Authenticate")
const authorizeRoles = require("../../Middlewares/Authorization")
const CATEGORY_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/4. CATEGORY")

const router = express.Router()

router.route("/admin/dashboard").get(authenticateToken, authorizeRoles("admin"),DASHBOARD_ADMIN) 

router.route("/admin/recent").get(authenticateToken, authorizeRoles("admin"),RECENT_ORDER)

router.route("/admin/products").get(authenticateToken, authorizeRoles("admin"),PRODUCT_ADMIN)

router.route("/admin/category").get(CATEGORY_ADMIN)
module.exports = router
