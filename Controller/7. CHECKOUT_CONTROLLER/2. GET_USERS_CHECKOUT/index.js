const {executeQuery} = require("../../../DATABASE/index")


const GET_USER_CHECKOUT = async (req, res) => {
    try 
    {
        const {id} = req.params;

        const query = `SELECT 
                    c.checkout_code,
                    c.product,
                    c.user,
                    q.invoice_id,
                    q.amount,
                    q.payment
                    FROM checkouts AS c
                    LEFT JOIN qpay_invoice q ON q.checkout_id = c.id
                    WHERE c.user = ?`

        const data = await executeQuery(query,[id])

        return res.status(200).json({data})
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

module.exports = GET_USER_CHECKOUT