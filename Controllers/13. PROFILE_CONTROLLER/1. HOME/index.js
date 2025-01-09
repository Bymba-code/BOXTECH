const {executeQuery} = require("../../../Database/test")

const PROFILE_HOME = async (req , res) => {
    try 
    {
        const {page, size} = req.query;
        
        const offset = (page - 1) * size;

        const countQueryQ = `
                            SELECT COUNT(DISTINCT products.id) AS total_count
                                FROM 
                                    products 
                                LEFT JOIN 
                                    product_checkout ON products.id = product_checkout.product
                                LEFT JOIN 
                                    product_invoice ON product_checkout.id = product_invoice.checkout_id
                                LEFT JOIN 
                                    deposit_history ON products.id = deposit_history.product
                                WHERE 
                                    product_invoice.payment = 1 
                                    AND products.user = ?
                                    AND MONTH(product_invoice.date) = MONTH(CURRENT_DATE())
                                    AND YEAR(product_invoice.date) = YEAR(CURRENT_DATE())
                                    AND DATE(product_invoice.date) = DATE(CURRENT_DATE())
                                `
        const totalResults = await executeQuery(countQueryQ, [req.user.id]);

        const totalCount = totalResults[0]?.total_count || 0;
        const maxPage = Math.ceil(totalCount / size);

        

        const paginationQuery =     `

                                SELECT DISTINCT
                                    products.id AS product_id,
                                    products.user AS owner_id,
                                    products.category AS product_category,
                                    products.product_name,
                                    products.price,
                                    products.img_url,
                                    product_checkout.user AS customer_id,
                                    product_checkout.amount,
                                    product_invoice.invoice_id,
                                    deposit_history.deposit,
                                    deposit_history.withdraw,
                                    product_invoice.date
                                FROM 
                                    products 
                                LEFT JOIN 
                                    product_checkout ON products.id = product_checkout.product
                                LEFT JOIN 
                                    product_invoice ON product_checkout.id = product_invoice.checkout_id
                                LEFT JOIN 
                                    deposit_history ON products.id = deposit_history.product
                                WHERE 
                                    product_invoice.payment = 1 
                                    AND products.user = ?
                                    AND MONTH(product_invoice.date) = MONTH(CURRENT_DATE())
                                    AND YEAR(product_invoice.date) = YEAR(CURRENT_DATE())
                                    AND DATE(product_invoice.date) = DATE(CURRENT_DATE())
                                LIMIT ? OFFSET ?
                                    `

        const todayQuery = await executeQuery(paginationQuery, [req.user.id, size.toString(), offset.toString()]);

        

        const countQuery = `
                            SELECT COUNT(*) AS product_count 
                            FROM products 
                            WHERE user = ?`
        
        const totalProducts = await executeQuery(countQuery, [req.user.id])

        const products = totalProducts[0].product_count

        const query =   `SELECT DISTINCT
                        products.id AS product_id,
                        products.user AS owner_id,
                        products.category AS product_category,
                        products.product_name,
                        products.price,
                        products.img_url,
                        product_checkout.user AS customer_id,
                        product_checkout.amount,
                        product_invoice.invoice_id,
                        deposit_history.deposit,
                        deposit_history.withdraw,
                        product_invoice.date
                        FROM 
                        products 
                        LEFT JOIN product_checkout ON products.id = product_checkout.product
                        LEFT JOIN product_invoice ON product_checkout.id = product_invoice.checkout_id
                        LEFT JOIN deposit_history ON products.id = deposit_history.product
                        WHERE product_invoice.payment = 1 AND products.user = ?`

        const data = await executeQuery(query, [req.user.id])
        
        return res.status(200).json({
            success:true,
            data:data,
            products,
            message: "Мэдээлэл амжилттай татлаа",
            todayQuery: todayQuery,
            maxPage
        })
    }   
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа гарлаа" + err
        })
    }
}       

module.exports = PROFILE_HOME