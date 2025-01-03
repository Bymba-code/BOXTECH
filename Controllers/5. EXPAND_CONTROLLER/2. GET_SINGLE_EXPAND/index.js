const {executeQuery} = require("../../../Database/test")

const GET_SINGLE_EXPAND = async (req , res) => {
    try 
    {
        const {user} = req.params;   
        const query = `SELECT * FROM expand_checkout 
                       LEFT JOIN expand_invoice ON expand_checkout.id = expand_invoice.checkout_id
                       WHERE user = ?`

        const data = await executeQuery(query, [user])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Өгөгдөл олдсонгүй"
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
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа : " + err 
        })
    }
}

module.exports = GET_SINGLE_EXPAND