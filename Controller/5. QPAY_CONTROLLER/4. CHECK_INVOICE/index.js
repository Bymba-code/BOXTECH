const { executeQuery } = require("../../../DATABASE/index");
const axios = require('axios');
require('dotenv').config();

const checkInvoice = async (req, res) => {
    const { id } = req.params;
    const {userId, product} = req.body;

    if(!id)
    {
      return res.status(404).json({
        success:false,
        data: null,
        message: "Нэхэмжлэлийн дугаарыг оруулна уу"
      })
    }
    
    const url = process.env.QPAY_URL + "/payment/check"

    const getTokenQuery = "SELECT * FROM qpay_token WHERE id = 1";
    const dbToken = await executeQuery(getTokenQuery);
    
    if (!dbToken || dbToken.length === 0) {
        return res.status(404).json({
            success: false,
            data: null,
            message: "Токен олдсонгүй"
        });
    }
    
    const { access_token } = dbToken[0];
    
    const invoiceQuery = "SELECT * FROM qpay_invoice WHERE invoice_id = ?";
    const invoiceDb = await executeQuery(invoiceQuery, [id]);
    
    if (!invoiceDb || invoiceDb.length === 0) {
        return res.status(404).json({
            success: false,
            data: null,
            message: "Нэхэмжлэл олдсонгүй"
        });
    }
    
    const invoice = invoiceDb[0];
    
    const invoiceData = {
        object_type: "INVOICE",
        object_id: invoice.invoice_id,
        offset: {
            page_number: 1,
            page_limit: 100
        }
    };

    try {
        const {data} = await axios.post(url, invoiceData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'Host': 'merchant.qpay.mn',
                'User-Agent': 'axios/1.7.7',
            }
        });


        if (data && data.paid_amount) {
          const selectInvoice = 'SELECT * FROM qpay_invoice WHERE invoice_id = ?'
          const invoiceData = await executeQuery(selectInvoice, [invoice.invoice_id])

        
          if(invoiceData[0].payment === 1)
          {
            return res.status(400).json({
              success:false, 
              message: "Нэхэмжлэл төлөгдсөн байна"
            })
          }
          
          const updateQuery = `UPDATE qpay_invoice SET payment = 1 WHERE invoice_id = ?`;
          await executeQuery(updateQuery, [invoice.invoice_id])

          const insertProductUser = "INSERT INTO user_product (`user`,`product`,`date`) VALUES (?, ? , ?)"
          
          const isInserted = await executeQuery(insertProductUser, [userId, product, new Date() ])

          
          return res.status(200).json({
                success: true,
                message: "Амжилттай төлөгдлөө"
          });
          

        } else {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Төлөлт хийгдээгүй"
            });
        }
    } catch (err) {

        if (err.response) {
            return res.status(err.response.status).json({
                success: false,
                data: err.response.data,
                message: "QPay API Error: " + (err.response.data.message || 'Unknown error')
            });
        }

        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа: " + err.message
        });
    }
};

module.exports = checkInvoice;
