const express =require("express")
const getToken = require("../../Controller/5. QPAY_CONTROLLER/1. GET_TOKEN")
const createInvoice = require("../../Controller/5. QPAY_CONTROLLER/3. CREATE_INVOICE")
const checkInvoice = require("../../Controller/5. QPAY_CONTROLLER/4. CHECK_INVOICE/index")
const router = express.Router()

router.route("/qpay/token").get(getToken)

router.route("/qpay/invoice").post(createInvoice)

router.route("/qpay/check/:id").post(checkInvoice)

module.exports = router