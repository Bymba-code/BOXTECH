const express = require("express")
const DASHBOARD_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/1. DASHBOARD")
const RECENT_ORDER = require("../../Controller/10. ADMIN_CONTROLLER/2. RECENT_PAYMENT")
const PRODUCT_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/3.PRODUCT")
const authenticateToken = require("../../Middlewares/Authenticate")
const authorizeRoles = require("../../Middlewares/Authorization")
const CATEGORY_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/4. CATEGORY")
const USERS_ADMIN = require("../../Controller/10. ADMIN_CONTROLLER/6.USERS")
const DELETE_USER = require("../../Controller/10. ADMIN_CONTROLLER/7. USER_DELETE")
const UPDATE_USER = require("../../Controller/10. ADMIN_CONTROLLER/8. USER_UPDATE")

const router = express.Router()

router.route("/admin/dashboard").get(DASHBOARD_ADMIN) 

router.route("/admin/recent").get(RECENT_ORDER)

router.route("/admin/products").get(PRODUCT_ADMIN)

router.route("/admin/category").get(CATEGORY_ADMIN)

router.route("/admin/users").get(USERS_ADMIN).post(DELETE_USER)

router.route("/admin/update/users").post(UPDATE_USER)

module.exports = router
