const express = require("express")
const GET_NEWS = require("../../Controllers/11. NEWS_CONTROLLER/1. GET_ALL")
const NEWS_CATEGORY = require("../../Controllers/12. NEWS_CATEGORY/1. GET")
const Authenticate = require("../../Middlewares/Authenticate")
const Authorize = require("../../Middlewares/Authorization")
const INSERT_NEWS = require("../../Controllers/12. NEWS_CATEGORY/2. INSERT")
const GET_SINGLE_NEWS = require("../../Controllers/11. NEWS_CONTROLLER/2. GET_SINGLE")
const COMMENT_NEWS = require("../../Controllers/11. NEWS_CONTROLLER/5. COMMENT")
const GET_COMMENT_NEWS = require("../../Controllers/13. NEWS_COMMENT/1. GET_ALL")
const CREATE_COMMENT_NEWS = require("../../Controllers/13. NEWS_COMMENT/2. INSERT")
const INSERT_REVIEWS_NEWS = require("../../Controllers/11. NEWS_CONTROLLER/6. REVIEWS")

const router = express.Router()

router.route("/news").get(GET_NEWS).post(Authenticate, Authorize(["admin", "user"]), INSERT_NEWS)

router.route("/news/single/:id").get(GET_SINGLE_NEWS)

router.route("/news/category").get(NEWS_CATEGORY)


router.route("/news/comment").post(Authenticate, CREATE_COMMENT_NEWS)

router.route("/news/comment/:id").get(GET_COMMENT_NEWS)


router.route("/reviews/news/:id").get(INSERT_REVIEWS_NEWS)

module.exports = router
