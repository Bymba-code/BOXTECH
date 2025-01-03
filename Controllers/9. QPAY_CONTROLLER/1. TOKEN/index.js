const axios = require('axios');
const CLIENT_ID = "BOXTECH_MN";
const CLIENT_SECRET = "WBDUzy8n";
const {executeQuery} = require("../../../Database/test")

const QPAY_TOKEN = async (req, res) => {

  // 1. Өгөгдлүүд
  const username = process.env.QPAY_CLIENT_ID;
  const password = process.env.QPAY_CLIENT_PASSWORD;
  const URL = process.env.QPAY_TOKEN_URL;

  try {

    // 2. Өмнөх токенийг авах
    const tokenQuery = "SELECT * FROM qpay_token WHERE id = 22"
    const tokenDB = await executeQuery(tokenQuery)
    if(!tokenDB)
    {
        return res.status(404).json({
            success:false,
            data: [],
            message: "Өгөгдлийн сангаас токен олдсонгүй."
        })
    }
    const accessToken = tokenDB[0].access_token
    const expires_at = tokenDB[0].expires_at

    // 3. Өмнөх токен дууссан эсэхийг шалгах
    
    const currentTime = new Date();
    console.log(new Date(expires_at))

    const { data } = await axios.post(
      URL,
      {}, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ':' + password),
          Host: 'merchant.qpay.mn',
          'User-Agent': 'insomnia/2022.2.1',  
          Accept: '*/*',
        },
      }
    );

    const newToken = data.access_token;
    const newRefreshToken = data.refresh_token;
    const expireDate = data.expires_in;
    const newExpireDate = new Date(Date.now() + expireDate * 1000)

    const insertQuery = "INSERT INTO qpay_token (`access_token`, `refresh_token`, `expires_at`) VALUES (? , ?, ?)"


    const insertData = await executeQuery(insertQuery, [newToken, newRefreshToken, newExpireDate])

    

    if(insertData)
    {
      return res.status(200).json({
        success:true, 
        data: data,
        message: "Амжилттай "
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false, 
      data:[],
      message: "Серверийн алдаа" + error
    })
  }
};

module.exports = QPAY_TOKEN
