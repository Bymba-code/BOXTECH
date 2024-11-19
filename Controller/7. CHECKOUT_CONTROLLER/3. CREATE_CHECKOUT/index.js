const {executeQuery} = require("../../../DATABASE/index")


const CREATE_CHECKOUT = async (req, res) => {
    try 
    {
       const {checkout_code , type, user, product} = req.body;

       const insertQuery = "INSERT INTO checkouts (`checkout_code`,`type`,`user`,`product`) VALUE (? , ? , ? , ?)"
    
       const values = [
        checkout_code,
        type, 
        user, 
        product
       ]

       const insertData = await executeQuery(insertQuery, values)

       if(insertData.affectedRows > 0)
       {
        return res.status(200).json({
            success:true,
            data:insertData,
            message: "Амжилттай үүслээ"
        })
       }

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: null,
            message: "Серверийн алдаа" + err
        })
    }
}

module.exports = CREATE_CHECKOUT