const {executeQuery} = require("../../../Database/test")

const USER_PRODUCT = async (req, res) => {
    try 
    {
       
        const query = "SELECT * FROM user_products WHERE user = ?" 


        const data = await executeQuery(query, [req.user.id])

        return res.status(200).json({
            success:false,
            data:data,
            message: "Амжилттай"
        })

    
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа : " + err 
        })
    }
}

module.exports = USER_PRODUCT 