const express = require("express")
const Authorize = require("../../Middlewares/Authorization")
const Authenticate = require("../../Middlewares/Authenticate")
const GET_ALL_FAVOURITE = require("../../Controllers/7. FAVOURITE_CONTROLLER/1. GET_ALL")
const GET_USER_FAVOURITE = require("../../Controllers/7. FAVOURITE_CONTROLLER/2. GET_BY_USER")
const INSERT_FAVOURITE = require("../../Controllers/7. FAVOURITE_CONTROLLER/3. INSERT_FAVOURITE")
const DELETE_FAVOURITE = require("../../Controllers/7. FAVOURITE_CONTROLLER/4. DELETE_FAVOURITE")

const router = express.Router()

router.route("/favourite")
.get(Authenticate, Authorize(["admin"]), GET_ALL_FAVOURITE)
.post(Authenticate, Authorize(["user"]), INSERT_FAVOURITE)
.delete(Authenticate, Authorize(["user"]), DELETE_FAVOURITE)

router.route("/favourite/user")
.get(Authenticate, Authorize(["user"]), GET_USER_FAVOURITE)

module.exports = router