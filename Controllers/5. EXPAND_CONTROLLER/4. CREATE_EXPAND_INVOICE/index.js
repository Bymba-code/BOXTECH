const axios = require('axios');
const {executeQuery} = require("../../../Database/test")
require('dotenv').config();


const CREATE_EXPAND_INVOICE = async (req, res) => {
    // 1. ХАНДАХ URL
    const URL = process.env.QPAY_URL + "/invoice"

    // 2. ТОКЕНИЙГ АВАХ
    const query = `SELECT * FROM qpay_token WHERE id = 22`
    const DB_TOKEN = await executeQuery(query)
    if(!DB_TOKEN)
    {
        return res.status(404).json({
            success:false,
            data: [],
            message: "QPAY токен олдсонгүй."
        })
    }
    const {access_token} = DB_TOKEN[0]

    try 
    {
        const {checkoutId} = req.params;
        
        const checkoutQuery = "SELECT * FROM expand_checkout WHERE id = ?"
        const checkoutDB = await executeQuery(checkoutQuery, [checkoutId])

        if(checkoutDB.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Чек олдсонгүй"
            })
        }

        const checkout = checkoutDB[0]        

        const invoiceData = {
            invoice_code: process.env.INVOICE_CODE, 
            sender_invoice_no: 'INVOICE' + Date.now(), 
            invoice_receiver_code: 'terminal', 
            invoice_description: checkout.description,
            amount: parseInt(checkout.amount),
            callback_url: 'http://omn1group.com/api/v1/register' + Date.now(),  
        };
        
        const response = await axios.post(
        URL,  
        invoiceData,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,  
                'User-Agent': 'Node.js',
                Accept: 'application/json',
              },
        }
        );

        if(!response.status === 200)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message:"Нэхэмжлэл үүсгэхэд алдаа гарлаа"
            })
        }
        
        const insertInvoiceQuery = "INSERT INTO expand_invoice (`checkout_id`,`invoice_id`,`payment`,`date`) VALUES (?,?,?,?)"
        const isInsert = await executeQuery(insertInvoiceQuery, [checkoutId, response.data.invoice_id, 0, new Date()])

        if(isInsert.affectedRows === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Нэхэмжлэл үүсгэхэд алдаа гарлаа"
            })
        }
        
        return res.status(200).json({
            success:true,
            data: response.data,
            message: "Амжилттай"
        })
        

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа" + err
        })
    }
   
    
};

module.exports = CREATE_EXPAND_INVOICE;
