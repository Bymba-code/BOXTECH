const axios = require('axios');
const {executeQuery} = require("../../../Database/test")
require('dotenv').config();


const CHECK_PRODUCT_INVOICE = async (req, res) => {
    
    // 1. ХАНДАХ URL
    const URL = process.env.QPAY_URL + "/payment/check"

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

    // GATEWAY TOKEN АВАХ
    const khanbankToken = `SELECT * FROM khanbank_token WHERE id = 1`
    const khanbank = await executeQuery(khanbankToken)
    
    if(khanbank.length === 0)
    {
        return res.status(404).json({
            success:false,
            data: [],
            message: "Gateway токен олдсонгүй."
        })
    }
    
    const gateToken = khanbank[0].access_token
    

    // 3. Өгөгдлүүд
    const {invoice, checkoutID} = req.params;
    if(!invoice)
    {
        return res.status(404).json({
            success:false,
            data: [],
            message: "Нэхэмжлэлийн дугаар олдсонгүй."
        })
    }
    if(!checkoutID)
    {
        return res.status(404).json({
            success:false,
            data: [],
            message: "Худалдан авах чекийн дугаар олдсонгүй."
        })
    }


    // Нэхэмжлэлийн мэдээллийг авах
    const checkoutQuery =  `SELECT 
                            products.id AS product_id,
                            products.user AS product_owner,
                            product_checkout.id AS checkout_id,
                            product_checkout.user AS checkout_creator,
                            product_checkout.amount AS price,
                            product_invoice.id AS invoice_id,
                            product_invoice.invoice_id AS invoice_code,
                            product_invoice.description,
                            product_invoice.payment,
                            product_invoice.date
                            FROM products
                            LEFT JOIN product_checkout ON products.id = product_checkout.product
                            LEFT JOIN product_invoice ON product_checkout.id = product_invoice.checkout_id
                            WHERE product_checkout.id = ? AND product_invoice.invoice_id = ?`

    const CHECKOUT_DB = await executeQuery(checkoutQuery , [checkoutID , invoice])

    if(CHECKOUT_DB.length === 0)
    {
        return res.status(404).json({
            success:false,
            data: [],
            message: "Төлбөрийн хүсэлт олдсонгүй"
        })
    }

    const checkout = CHECKOUT_DB[0]

    const invoiceData = {
        object_type: "INVOICE",
        object_id: checkout.invoice_code,
        offset: {
            page_number: 1,
            page_limit: 100
        }
    };

     // Эзэмшигчийн дансны дугаар авах
    const bankQuery = "SELECT * FROM user_bank WHERE user = ?"
    const BANK_DB = await executeQuery(bankQuery, [checkout.product_owner])
    if(BANK_DB.length === 0)
    {
        return res.status(404).json({
            success:false,
            data: [],
            message: "Эзэмшигчийн дансны дугаар бүртгэгдээгүй эсвэл хоосон байна."
        })
    }
    const bank = BANK_DB[0]



    // Төлбөр төлөгдсөн эсэхийг ахин дархад шалгаж хариу өгөх
    if(checkout.payment === 1)
    {
        return res.status(300).json({
            success:true,
            data: [],
            message: "Нэхэмжлэлийн төлбөр төлөгдсөн байна."
        })
    }


    try 
    {
        const {data} = await axios.post(URL, invoiceData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                    'Host': 'merchant.qpay.mn',
                    'User-Agent': 'axios/1.7.7',
                }
        });
        
        

        if(data && data.paid_amount)
            {
                
                // Төлбөр төлөгдсөнийг бататгах
                const updateQuery = "UPDATE product_invoice SET payment = 1 WHERE invoice_id = ?"
                const isUpdated = await executeQuery(updateQuery, [invoice])
                if(isUpdated.affectedRows === 0)
                {
                    return res.status(404).json({
                        success:false,
                        data: [],
                        message: "Ямар нэгэн алдаа гарлаа"
                    })
                }

                const queryOne = "SELECT * FROM user_products WHERE user = ? AND product = ?"
                const dataOne = await executeQuery(queryOne, [req.user.id, checkout.product_id])
                if(dataOne.length === 0)
                {
                const date = new Date()
                date.setDate(date.getDate() + 3)
                const insertQuery = "INSERT INTO user_products (`user`,`product`,`date`) VALUES ( ? , ? , ?)"
                const inserted = await executeQuery(insertQuery, [req.user.id, checkout.product_id, date ])
                }

                const date = new Date()
                date.setDate(date.getDate() + 3)
                const updateQueryOne = "UPDATE user_products SET date = ? WHERE user = ? AND product = ?"
                const dataTwo = await executeQuery(updateQueryOne, [date, req.user.id, checkout.product_id])

                // Тооцоо
                const amount = checkout.price
                const withdraw = amount * 0.2;
                const deposit = amount * 0.79;

                

                const apiUrl = "https://api.khanbank.com/v1/transfer/domestic";
   
                const body = {
                fromAccount : "5175250342",
                toAccount: bank.account,
                toCurrency: "MNT",
                amount: deposit,
                description: `#${checkout.product_id} ID-тай барааны орлого`,
                currency:"MNT",
                loginName: process.env.GATEWAY_TRANS_LOGINNAME,
                tranPassword:process.env.GATEWAY_TRANSPASS
                };

                // Шилжүүлгийн API
                const response = await axios.post(apiUrl, body,{
                    headers: {
                        Authorization: `Bearer ${gateToken}`,
                        'Content-Type' : 'application/json'
                    }
                });

                const insertHistory = "INSERT INTO deposit_history (`user`,`product`,`deposit`,`withdraw`,`date`) VALUES (?,?,?,?,?)"
                const isInsert = await executeQuery(insertHistory, [checkout.product_owner, checkout.product_id, deposit, withdraw, new Date()])

                if(isInsert.affectedRows === 0)
                {
                    return res.status(404).json({
                        success: false,
                        data: [],
                        message: "Шилжүүлгийг архивлахад алдаа гарлаа"
                    })
                }

                // Амжилттай
                return res.status(200).json({
                success: true,
                data: response.data,
                message: "Бүр процесс болон шилжүүлгийг амжилттай хийлээ танд баярлалаа.",
                });
               
            }
        else 
        {     
            return res.status(404).json({
                success:false,
                data:[],
                message:"Төлөлт хийгдээгүй байна."
            })
        }
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа" + err
        })
    }
   
    
};

module.exports = CHECK_PRODUCT_INVOICE
