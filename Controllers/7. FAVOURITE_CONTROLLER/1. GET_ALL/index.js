const {executeQuery} = require("../../../Database/test")

const GET_ALL_FAVOURITE = async (req , res) => {
    try 
    {
        const query = `SELECT 
                       users.username,
                       users.email,
                       COUNT(user_favourite.id) AS favourite_count
                       FROM 
                       user_favourite
                        LEFT JOIN 
                        users 
                        ON 
                        user_favourite.user = users.id
                        GROUP BY 
                        users.id, users.username
                        ORDER BY 
                        favourite_count DESC;`

        const data = await executeQuery(query)
        
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

module.exports = GET_ALL_FAVOURITE