const {executeQuery} = require("../../../Database/test")
const axios = require("axios")
require("dotenv").config()

const refreshQpayToken = async () => {
    const response = await axios.post(
        'https://merchant.qpay.mn/v2/auth/token',
        {}, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('BOXTECH_MN' + ':' + 'SW5jzYKU'),
                Host: 'merchant.qpay.mn',
                'User-Agent': 'insomnia/2022.2.1',  
                Accept: '*/*',
            },
        }
    );
    return response.data;
};


const CREATE_CHECKOUT_INVOICE = async (req, res) => {
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
        const {checkoutID} = req.params;

        const checkoutQuery = "SELECT * FROM product_checkout WHERE id = ?"
        const checkoutDB = await executeQuery(checkoutQuery, [checkoutID])

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
            invoice_description: `#${checkout.id} нэхэмжлэлийн төлбөр`,
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

        if(response.status !== 200)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message:"Нэхэмжлэл үүсгэхэд алдаа гарлаа"
            })
        }

        const insertQuery = "INSERT INTO product_invoice (`checkout_id`,`invoice_id`,`description`,`payment`,`date`) VALUES (?,?,?,?,?)"
        const isInserted = await executeQuery(insertQuery, [checkout.id, response.data.invoice_id, `#${checkout.id} ID-тай нэхэмжлэл төлбөр`, 0 , new Date()])
        if(isInserted.affectedRows === 0)
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
        if (err.response && err.response.status === 401) {
            try {
                const { access_token: newAccessToken, refresh_token } = await refreshQpayToken();
                const updateQuery = "UPDATE qpay_token SET access_token = ? , refresh_token = ? WHERE id = 22";
                const updateData = await executeQuery(updateQuery, [newAccessToken, refresh_token]);

                if (updateData.affectedRows === 0) {
                    return res.status(500).json({
                        success: false,
                        data: [],
                        message: "QPAY токеныг шинэчлэхэд алдаа гарлаа"
                    });
                }

                access_token = newAccessToken;
                return CREATE_EXPAND_INVOICE(req, res);  

            } catch (tokenErr) {
                return res.status(500).json({
                    success: false,
                    data: [],
                    message: "Токен шинэчлэхэд алдаа гарлаа"
                });
            }
        }

        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа : " + access_token
        })
    }
}

module.exports = CREATE_CHECKOUT_INVOICE 