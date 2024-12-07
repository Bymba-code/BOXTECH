const {executeQuery} = require("../../../DATABASE/index")

const CATEGORY_ADMIN = async (req, res) => {
    try 
    {
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate offset
       const query = `SELECT 
                c.id AS category_id,
                c.name AS category_name,
                COUNT(DISTINCT p.id) AS total_products,
                COUNT(ps.id) AS total_sales
            FROM 
                categories c
            LEFT JOIN 
                products p ON c.id = p.category
            LEFT JOIN 
                product_sell ps ON ps.product = p.id
            GROUP BY 
                c.id, c.name
            LIMIT ${limit} OFFSET ${offset};
`
    const data = await executeQuery(query)
    
            const countQuery = `
            SELECT COUNT(*) AS total
            FROM categories;
        `;
        const totalCountResult = await executeQuery(countQuery);
        const totalCount = totalCountResult[0]?.total || 0;

        if (data) {
            return res.status(200).json({
                success: true,
                data: data,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                message: "Амжилттай",
            });
        }
    
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа" + err
        })
    }
}

module.exports = CATEGORY_ADMIN 
