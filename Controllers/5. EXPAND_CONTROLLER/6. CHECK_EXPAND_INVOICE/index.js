const axios = require('axios');
const {executeQuery} = require("../../../Database/test")
require('dotenv').config();


const CHECK_EXPAND_INVOICE = async (req, res) => {
    // 1. ХАНДАХ URL
    const URL = process.env.QPAY_URL + "/payment/check"

    // 2. ТОКЕНИЙГ АВАХ
    const query = `SELECT * FROM qpay_token WHERE id =22`
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

  
    const {checkoutId, invoice} = req.params;

    if(!checkoutId)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Нэхэмжлэлийн дугаар буруу эсвэл байхгүй байна."
            })
    }

    const checkoutQuery = `SELECT * FROM expand_checkout 
                           LEFT JOIN expand_invoice ON expand_checkout.id = expand_invoice.checkout_id
                           WHERE expand_checkout.id = ? AND expand_invoice.invoice_id = ? AND expand_checkout.user = ?`
    const checkoutDB = await executeQuery(checkoutQuery, [checkoutId, invoice, req.user.id])
    if(checkoutDB.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Чек олдсонгүй"
            })
    }
    
    const checkout = checkoutDB[0]

    if(checkout.payment === 1)
    {
        return res.status(300).json({
            success:false,
            data: [],
            message: "Төлбөр төлөгдсөн байна."
        })
    }

    const invoiceData = {
        object_type: "INVOICE",
        object_id: checkout.invoice_id,
        offset: {
            page_number: 1,
            page_limit: 100
        }
    };


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
            const updateQuery = "UPDATE expand_invoice SET payment = 1 WHERE invoice_id = ?"
            const isUpdate = await executeQuery(updateQuery, [checkout.invoice_id])

            if(isUpdate.affectedRows === 0)
            {
                return res.status(404).json({
                    success:false,
                    data:[],
                    message:"Ямар нэгэн алдаа гарлаа"
                })
            }
            
            if(checkout.description === "1 сарын сунгалт")
                {
                    const startDate = new Date()
                    const endDate = new Date()
                    endDate.setMonth(endDate.getMonth() + 1)
                    const updateDateQuery = "UPDATE user_subscription SET start_date = ? , end_date = ? WHERE user = ?"
                    const updated = await executeQuery(updateDateQuery, [startDate, endDate, req.user.id])
                    if(updated.affectedRows === 0)
                        {
                            return res.status(404).json({
                                success:false,
                                data: [],
                                message: "Сунгалт хийхэд алдаа гарлаа"
                            })
                    }
            
            }
            if(checkout.description === "2 сарын сунгалт")
                {
                    const startDate = new Date()
                    const endDate = new Date()
                    endDate.setMonth(endDate.getMonth() + 2)
                    const updateDateQuery = "UPDATE user_subscription SET start_date = ? , end_date = ? WHERE user = ?"
                    const updated = await executeQuery(updateDateQuery, [startDate, endDate, req.user.id])
                    if(updated.affectedRows === 0)
                    {
                        return res.status(404).json({
                            success:false,
                            data: [],
                            message: "Сунгалт хийхэд алдаа гарлаа"
                        })
                    }

            }
            if(checkout.description === "3 сарын сунгалт")
                {
                    const startDate = new Date()
                    const endDate = new Date()
                    endDate.setMonth(endDate.getMonth() + 3)
                    const updateDateQuery = "UPDATE user_subscription SET start_date = ? , end_date = ? WHERE user = ?"
                    const updated = await executeQuery(updateDateQuery, [startDate, endDate, req.user.id])
                    if(updated.affectedRows === 0)
                    {
                        return res.status(404).json({
                            success:false,
                            data: [],
                            message: "Сунгалт хийхэд алдаа гарлаа"
                        })
                    }

            }

            const startDate = new Date()
            let endDate = new Date()
            if(checkout.description === "1 сарын сунгалт")
            {
                endDate.setMonth(endDate.getMonth() + 1)

            }
            if(checkout.description === "2 сарын сунгалт")
                {
                endDate.setMonth(endDate.getMonth() + 2)
    
                }
            if(checkout.description === "3 сарын сунгалт")
                {
                endDate.setMonth(endDate.getMonth() + 3)
        
                }

            const insertNoti = "INSERT INTO notifications (`user`,`title`,`content`,`isView`, `date`) VALUES (? , ? , ? , ? , ?)"
            const notiData = await executeQuery(insertNoti, [req.user.id , "Амжилттай сунгалаа", `Таны эрх дуусах хугацаа ${endDate.toLocaleDateString()}`, 0, new Date()])

            return res.status(200).json({
                success:true,
                data:[],
                message:"Сунгалтыг амжилттай хийлээ"
            })
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
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа" + err
        })
    }
   
    
};

module.exports = CHECK_EXPAND_INVOICE;
