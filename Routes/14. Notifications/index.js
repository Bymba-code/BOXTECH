const express = require("express")
const GET_NOTIFICATIONS = require("../../Controllers/14. NOTIFICATION_CONTROLLER/1. GET")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const INSERT_NOTIFICATIONS = require("../../Controllers/14. NOTIFICATION_CONTROLLER/2. POST")
const UPDATE_NOTIFICATIONS = require("../../Controllers/14. NOTIFICATION_CONTROLLER/3. UPDATE")

const router = express.Router()

router.route("/notifications")
.get(Authenticate, GET_NOTIFICATIONS)
.post(Authenticate, Authorize(["admin"]), INSERT_NOTIFICATIONS)
.put(Authenticate ,UPDATE_NOTIFICATIONS)

module.exports = router