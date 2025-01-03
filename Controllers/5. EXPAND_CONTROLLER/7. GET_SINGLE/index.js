const {executeQuery} = require("../../../Database/test")

const GET_BYID_EXPAND= async (req , res) => {
    try 
    {
        const {id} = req.params
        const query =  `SELECT 
                        expand_checkout.id AS checkout_id,
                        expand_checkout.user,
                        expand_checkout.amount,
                        expand_checkout.description,
                        expand_invoice.id AS expand_invoice_row_id,
                        expand_invoice.invoice_id,
                        expand_invoice.payment,
                        expand_invoice.date
                        FROM expand_checkout 
                        LEFT JOIN expand_invoice ON expand_checkout.id = expand_invoice.checkout_id                     
                        WHERE expand_checkout.id = ? AND expand_checkout.user = ?
                        `
        const data = await executeQuery(query, [id, req.user.id])

        if(data[0].payment === 1)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Чек дууссан байна"
            })
        }
    

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

module.exports = GET_BYID_EXPAND