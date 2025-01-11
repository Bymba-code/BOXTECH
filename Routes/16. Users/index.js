const express = require("express")
const GET_USERS = require("../../Controllers/16. USERS/1. GET")
const DELETE_USERS = require("../../Controllers/16. USERS/2. DELETE")
const INSERT_USERS = require("../../Controllers/16. USERS/3. INSERT")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const DASHBOARD = require("../../Controllers/17. DASHBOARD_CONTROLLER/DASHBOARD")

const router = express.Router()

router.route("/users")
.get(Authenticate, Authorize(["admin"]), GET_USERS)
.delete(Authenticate, Authorize(["admin"]), DELETE_USERS)
.post(Authenticate, Authorize(["admin"]), INSERT_USERS)

router.route("/stats").get(DASHBOARD)

module.exports = router