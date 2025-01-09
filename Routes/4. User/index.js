const express = require("express")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const INSERT_BANK = require("../../Controllers/4. USER_CONTROLLER/1. INSERT_BANK")
const UPDATE_BANK = require("../../Controllers/4. USER_CONTROLLER/2. UPDATE_BANK")
const DELETE_BANK = require("../../Controllers/4. USER_CONTROLLER/3. DELETE_BANK")
const USER_PRODUCT = require("../../Controllers/4. USER_CONTROLLER/4. USER_PRODUCTS")

const router = express.Router()

router.route("/bank/account")
.post(Authenticate, Authorize(["user"]), INSERT_BANK)
.put(Authenticate, Authorize(["user"]), UPDATE_BANK)
.delete(Authenticate, Authorize(["user"]), DELETE_BANK)

router.route("/users/products").get(Authenticate, USER_PRODUCT)


module.exports = router
