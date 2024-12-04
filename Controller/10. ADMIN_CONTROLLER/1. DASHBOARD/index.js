const {executeQuery} = require("../../../DATABASE/index")


const DASHBOARD_ADMIN = async (req, res) => {
    try 
    {

        

        const query = `
                        SELECT 
                        users.id,
                        users.username,
                        checkouts.type,
                        qpay_invoice.amount,
                        qpay_invoice.payment,
                        qpay_invoice.date,
                        statement.deposit,
                        statement.withdraw
                        FROM users
                        LEFT JOIN checkouts ON users.id = checkouts.user
                        LEFT JOIN qpay_invoice ON checkouts.id = qpay_invoice.checkout_id
                        LEFT JOIN statement ON checkouts.id = statement.checkout_id
                        ORDER BY qpay_invoice.date DESC;
                       `
        const invoice = await executeQuery(query)

        const userQ = `SELECT 
                      users.*, 
                      COUNT(products.id) AS total_products
                      FROM users
                      LEFT JOIN products ON users.id = products.user
                      GROUP BY users.id
                      ORDER BY total_products DESC;`

        const user = await executeQuery(userQ)

        return res.status(200).json({
            success:true,
            invoice:invoice,
            user:user,
            message: "Амжилттай"
        })

    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа: " + err.message
        });
    }
}

module.exports = DASHBOARD_ADMIN