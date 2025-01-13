const {executeQuery} = require("../../../Database/test")

const DASHBOARD = async (req , res) => {
    try 
    {
        const queryOne = `SELECT 
                          SUM(deposit) AS total_deposit,
                          SUM(withdraw) AS total_withdraw
                          FROM 
                          deposit_history;
                         `

        const queryTwo = `SELECT 
                          COUNT(*) AS payment_count
                          FROM 
                          product_invoice
                          WHERE 
                          payment = 1;`

        const queryThree =  `WITH months AS (
                                SELECT 1 AS month_number UNION ALL
                                SELECT 2 UNION ALL
                                SELECT 3 UNION ALL
                                SELECT 4 UNION ALL
                                SELECT 5 UNION ALL
                                SELECT 6 UNION ALL
                                SELECT 7 UNION ALL
                                SELECT 8 UNION ALL
                                SELECT 9 UNION ALL
                                SELECT 10 UNION ALL
                                SELECT 11 UNION ALL
                                SELECT 12
                                )
                                SELECT 
                                m.month_number AS month,
                                COALESCE(COUNT(pi.id), 0) AS total_invoices
                                FROM 
                                months m
                                LEFT JOIN 
                                product_invoice pi
                                ON MONTH(pi.date) = m.month_number
                                AND YEAR(pi.date) = YEAR(CURDATE())
                                AND pi.payment = 1 
                                GROUP BY 
                                m.month_number
                                ORDER BY 
                                m.month_number;
                                `
        const queryFour =  `WITH user_counts AS (
                            SELECT 
                            COUNT(*) AS user_count,
                            MONTH(create_date) AS month,
                            YEAR(create_date) AS year
                            FROM 
                            users
                            WHERE 
                            create_date >= DATE_ADD(CURDATE(), INTERVAL -2 MONTH) 
                            GROUP BY 
                            YEAR(create_date), MONTH(create_date)
                            )
                            SELECT 
                            MAX(CASE WHEN month = MONTH(CURDATE()) THEN user_count END) AS current_month_users,
                            MAX(CASE WHEN month = MONTH(DATE_ADD(CURDATE(), INTERVAL -1 MONTH)) THEN user_count END) AS last_month_users,
                            ROUND(AVG(user_count), 2) AS average_users
                            FROM 
                            user_counts;
                            `

        const queryFive =   `SELECT 
                            users.username,
                            products.id AS product_id,
                            products.product_name AS product_name,
                            COUNT(deposit_history.id) AS total_downloads
                            FROM 
                            products
                            LEFT JOIN 
                            deposit_history 
                            ON 
                            products.id = deposit_history.product
                            LEFT JOIN 
                            users
                            ON 
                            users.id = products.user
                            GROUP BY 
                            products.id, products.product_name
                            ORDER BY 
                            total_downloads DESC;`


        const querySix = `SELECT COUNT(*) as total_users FROM users`

        const querySeven = `SELECT DISTINCT * FROM 
                            products
                            LEFT JOIN users ON products.user = users.id
                            LEFT JOIN deposit_history ON products.id = deposit_history.product
                            ORDER BY deposit_history.date DESC
                            LIMIT 5`

        const queryEight = `SELECT 
                            COUNT(*) AS total_files
                            FROM products
                            `

        const depositWithdraw = await executeQuery(queryOne)
        const invoices = await executeQuery(queryTwo)
        const purchases = await executeQuery(queryThree)
        const users = await executeQuery(queryFour)
        const files = await executeQuery(queryFive)
        const totalusers = await executeQuery(querySix)
        const relatedInvoices = await executeQuery(querySeven)
        const totalFiles = await executeQuery(queryEight)

        return res.status(200).json({
            depositWithdraw: depositWithdraw,
            invoices: invoices,
            purchases:purchases,
            users:users,
            files:files,
            totalusers: totalusers,
            relatedInvoices:relatedInvoices,
            totalFiles:totalFiles
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Амжилтгүй"
        })
    }
}

module.exports = DASHBOARD
