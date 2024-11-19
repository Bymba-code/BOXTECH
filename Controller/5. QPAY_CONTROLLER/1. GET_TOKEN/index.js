const axios = require('axios');

const {executeQuery} = require("../../../DATABASE")

const getToken = async (req, res) => {
  try {

    const { data } = await axios.post(
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

    const insertQuery = "INSERT INTO qpay_token (`access_token`, `refresh_token`) VALUES (? , ?)"

    const insertData = await executeQuery(insertQuery, [data.access_token, data.refresh_token])

    if(insertData)
    {
      return res.status(200).json({
        success:true, 
        data: null,
        message: "Амжилттай "
      })
    }

  } catch (error) {
    return res.status(500).json({
      success: false, 
      data: null,
      message: "Серверийн алдаа" + error
    })
  }
};

module.exports = getToken;
