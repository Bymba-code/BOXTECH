const {executeQuery} = require("../../../Database/test")

const GET_USER_PRODUCT = async (req, res) => {
    try 
    {
        const {page, size} = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(size, 10);

        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber <= 0 || pageSize <= 0) {
            return res.status(400).json({
              success: false,
              data: [],
              message: "Хуудасны эсвэл хэмжээг зөв оруулна уу.",
            });
        }
        
        const countQuery = `
        SELECT COUNT(*) as total_count
        FROM products
        WHERE products.user = ?
        `;
            const countData = await executeQuery(countQuery, [req.user.id]);
            const totalCount = countData[0]?.total_count || 0;
            
            // Step 2: Calculate maxPage
            const maxPage = Math.ceil(totalCount / pageSize);

        const offset = (pageNumber - 1) * pageSize;

        const query =   `
                        SELECT DISTINCT
                        products.*,
                        category.name AS category_name,
                        AVG(product_rating.rating) AS average_rating,
                        COUNT(product_reviews.id) AS review_count,
                        SUM(deposit_history.deposit) AS total_deposit_amount,
                        COUNT(deposit_history.id) AS deposit_count
                        FROM
                        products
                        LEFT JOIN category 
                        ON products.category = category.id
                        LEFT JOIN product_rating 
                        ON products.id = product_rating.product
                        LEFT JOIN product_reviews 
                        ON products.id = product_reviews.product
                        LEFT JOIN deposit_history 
                        ON products.id = deposit_history.product
                        WHERE products.user = ?
                        GROUP BY 
                        products.id, category.id, deposit_history.id
                        LIMIT ? OFFSET ?
`
       
        const data = await executeQuery(query, [req.user.id, size.toString(), offset.toString()])

        return res.status(200).json({
            data:data,
            maxPage:maxPage
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

module.exports = GET_USER_PRODUCT
