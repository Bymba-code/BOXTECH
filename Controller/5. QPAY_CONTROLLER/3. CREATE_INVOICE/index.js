const axios = require('axios');
const {executeQuery} = require("../../../DATABASE/index")
require('dotenv').config();

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI4NTQxYWQwMy04Nzg3LTQ3ZGYtYjU0Ny02NjAyNjg5Y2NmNjQiLCJzZXNzaW9uX2lkIjoiV0NyR2tQb2lVcE1ud3NfUmptUDUwSjRYODZGR2xzSlEiLCJpYXQiOjE3MzE5MjAwMTcsImV4cCI6MzQ2MzkyNjQzNH0.PzsiVJCAarhL3_dip0RBnhWfmTNWECavCSn61D812EY"

const createInvoice = async (req, res) => {

  
  const url = process.env.QPAY_URL + "/invoice"
  const getTokenQuery = "SELECT * FROM qpay_token WHERE id = 1";
  const dbToken = await executeQuery(getTokenQuery);
    
  if (!dbToken || dbToken.length === 0) 
    {
      return res.status(404).json({
          success: false,
          data: null,
          message: "Токен дууссан эсвэл байхгүй байна."
      });
    }
  const {access_token} = dbToken[0];

  try {
    const {name , desc, amount, checkout_id} = req.body;


    const invoiceData = {
      invoice_code: process.env.INVOICE_CODE, 
      sender_invoice_no: 'INVOICE' + Date.now(), 
      name: name,
      invoice_receiver_code: 'terminal', 
      invoice_description: desc, 
      amount: parseInt(amount),
      callback_url: 'http://omn1group.com/api/v1/register' + Date.now(), 
      
    };

    
  
    const { data }  = await axios.post(
      url,  
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

    const insertData = await data

    const query = 'INSERT INTO qpay_invoice (`invoice_id`, `amount`, `user`, `date`, `checkout_id`) VALUES (?, ?, ?, ?, ?)';
    const values = [insertData.invoice_id, parseInt(amount), name, new Date(), checkout_id];
    await executeQuery(query, values);

    res.status(200).json(data);  
  } catch (error) {
    console.error("Error creating invoice:", error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 400).json({
      error: error.response ? error.response.data : error.message || "An error occurred while creating the invoice.",
    });
  }
};

module.exports = createInvoice;
