const {executeQuery} = require("../../../Database/test")


const GET_SINGLE_PRODUCT_CHECKOUT_USER = async (req, res) => {
    try 
    {
        const user = req.user    

        const query = `SELECT * FROM product_checkout LEFT JOIN product_invoice ON product_checkout.id = product_invoice.checkout_id WHERE user = ?`

        const data = await executeQuery(query, [user.id])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Өгөгдөл олдсонгүй."
            })
        }

        return res.status(200).json({
            success:true,
            data: data,
            message:"Амжилттай"
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

module.exports = GET_SINGLE_PRODUCT_CHECKOUT_USER