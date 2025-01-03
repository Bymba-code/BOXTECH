const {executeQuery} = require("../../../Database/test")

const GET_USER_FAVOURITE = async (req , res) => {
    try 
    {
        const query =  `SELECT 
                        * FROM user_favourite
                        LEFT JOIN products ON user_favourite.product = products.id
                        WHERE user_favourite.user = ?
                        `

        const data = await executeQuery(query, [req.user.id])
        
        return res.status(200).json({
            success:true,
            data: data,
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

module.exports = GET_USER_FAVOURITE