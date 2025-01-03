const {executeQuery} = require("../../../Database/test")


const CREATE_CHECKOUT = async (req, res) => {
    try 
    {
        
       const user = req.user;
       const {product, amount} = req.body;

        if(!product)
        { 
            return res.status(404).json({
                success:false,
                data: [],
                message: "Файл байхгүй байна."
            })
        }
        if(!amount)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Үнийн дүн байхгүй байна."
            })
        }

        const query = "INSERT INTO product_checkout (`user`,`product`,`amount`) VALUES (?,?,?)"
        const data = await executeQuery(query, [user.id, product, amount])

        if(data.affectedRows === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Чек үүсгэхэд алдаа гарлаа"
            })
        }
        
        return res.status(200).json({
            success:true,
            data: data,
            message: "Амжилттай"
        })

    }
    catch(err)
    {
        
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа: " + (err.message || err),
        });
    }
}

module.exports = CREATE_CHECKOUT