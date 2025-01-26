const express = require("express")
const GET_ALL_NMZ = require("../../Controllers/20. NMZ_CONTROLLER/1. GET_ALL")
const INSERT_NMZ = require("../../Controllers/20. NMZ_CONTROLLER/2. INSERT")

const router = express.Router()

router.route("/nmz").get(GET_ALL_NMZ).post(INSERT_NMZ)

module.exports = router