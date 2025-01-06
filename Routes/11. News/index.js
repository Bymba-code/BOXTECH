const express = require("express")
const GET_NEWS = require("../../Controllers/11. NEWS_CONTROLLER/1. GET_ALL")
const NEWS_CATEGORY = require("../../Controllers/12. NEWS_CATEGORY/1. GET")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const INSERT_NEWS = require("../../Controllers/12. NEWS_CATEGORY/2. INSERT")
const GET_SINGLE_NEWS = require("../../Controllers/11. NEWS_CONTROLLER/2. GET_SINGLE")

const router = express.Router()

router.route("/news").get(GET_NEWS).post(Authenticate, Authorize(["admin", "user"]), INSERT_NEWS)

router.route("/news/single/:id").get(GET_SINGLE_NEWS)

router.route("/news/category").get(NEWS_CATEGORY)

module.exports = router