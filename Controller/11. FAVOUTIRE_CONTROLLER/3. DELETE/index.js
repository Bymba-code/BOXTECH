const {executeQuery} = require("../../../DATABASE/index")

const DELETE_FAVOURITE = async (req, res) => {
    try 
    {
        const {user, product} = req.body;

        console.log(product)
        if(!user)
        {
            return res.status(403).json({
                success:false, 
                data:null,
                message:"Хэрэглэгч байхгүй байна."
            })
        }
        if(!product)
        {
            return res.status(403).json({
                success:false,
                data: null,
                message: "Файл байхгүй байна."
            })
        }

        const checkQuery = "SELECT * FROM user_favourite WHERE product = ? and user = ?"

        const isAvailable = await executeQuery(checkQuery, [product, user])

        if(isAvailable.length === 0)
        {
            return res.status(403).json({
                success:false,
                data: null,
                message: "Танд таалагдсан файл байхгүй байна."
            })
        }


        const query = "DELETE FROM user_favourite WHERE user = ? AND product = ?"




        const data = await executeQuery(query, [user, product])

        if(data.affectedRows > 0)
        {
            return res.status(200).json({
                success:true,
                data:null,
                message: "Амжилттай"
            })
        }

    }
    catch(err)
    {
        console.error("Error executing query:", err);
        return res.status(500).json({
            success: false,
            message: "Серверийн алдаа. Дэлгэрэнгүй мэдээллийг логуудаас шалгана уу."
        });
    
    }
}

module.exports = DELETE_FAVOURITE 