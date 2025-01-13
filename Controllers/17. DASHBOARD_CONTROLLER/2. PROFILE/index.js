const {executeQuery} = require("../../../Database/test")

const DASHBOARD_PROFILE = async (req , res) => {
    try 
    {   
        const queryOne =   `SELECT 
                            deposit_history.user,
                            SUM(deposit) as orlogo,
                            SUM(withdraw) as zarlaga,
                            COUNT(deposit_history.id) as borluulalt
                            FROM 
                            deposit_history 
                            WHERE user = ?`
    
        const queryTwo =   `SELECT 
                            COUNT(products.id) as files
                            FROM 
                            products 
                            WHERE user = ?`
        
        const queryThree = `
                            WITH months AS (
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
                            COALESCE(SUM(dh.deposit), 0) AS total_deposit
                            FROM 
                            months m
                            LEFT JOIN 
                            deposit_history dh
                            ON MONTH(dh.date) = m.month_number
                            AND YEAR(dh.date) = YEAR(CURDATE())
                            AND dh.user = ?
                            GROUP BY 
                            m.month_number
                            ORDER BY 
                            m.month_number;
                            `

        const queryFour =  `SELECT 
                            deposit_history.user,
                            SUM(deposit_history.deposit) AS orlogo,   
                            SUM(deposit_history.withdraw) AS zarlaga, 
                            COUNT(deposit_history.id) AS borluulalt   
                            FROM 
                            deposit_history
                            WHERE 
                            deposit_history.user = ?
                            AND YEAR(deposit_history.date) = YEAR(CURDATE())   
                            AND MONTH(deposit_history.date) = MONTH(CURDATE()) 
                            GROUP BY 
                            deposit_history.user;
                        `
        
        const queryFive =  `SELECT DISTINCT
                            product_checkout.id as checkout,
                            product_checkout.user AS customer_id,
                            products.product_name AS file_name,
                            product_invoice.payment AS status,
                            products.price AS file_price,
                            deposit_history.deposit AS orlogo
                            FROM products
                            LEFT JOIN product_checkout ON products.id = product_checkout.product
                            LEFT JOIN product_invoice ON product_checkout.id = product_invoice.checkout_id
                            LEFT JOIN users ON users.id = product_checkout.user
                            LEFT JOIN deposit_history ON deposit_history.product = products.id
                            WHERE product_invoice.payment = 1 AND products.user = 5
                            ORDER BY product_invoice.date DESC
                            LIMIT 10`

        const firstData = await executeQuery(queryOne, [req.user.id])

        const secondData = await executeQuery(queryTwo, [req.user.id])

        const thirdData = await executeQuery(queryThree, [req.user.id])
        
        const fourthData = await executeQuery(queryFour, [req.user.id])

        const fifthData = await executeQuery(queryFive, [req.user.id])

        return res.status(200).json({
            success:true,
            dataOne: firstData,
            dataTwo:secondData,
            dataThree:thirdData,
            fourthData: fourthData,
            fifthData: fifthData
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

module.exports = DASHBOARD_PROFILE