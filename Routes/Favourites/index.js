const express = require("express")
const GET_FAVOUTIRES = require("../../Controller/11. FAVOUTIRE_CONTROLLER/1. GET")
const POST_FAVOURITE = require("../../Controller/11. FAVOUTIRE_CONTROLLER/2. POST")
const DELETE_FAVOURITE = require("../../Controller/11. FAVOUTIRE_CONTROLLER/3. DELETE")

const router = express.Router()

router.route("/favourites").post(POST_FAVOURITE).delete(DELETE_FAVOURITE)

router.route("/favourites/:userId").get(GET_FAVOUTIRES)

module.exports = router