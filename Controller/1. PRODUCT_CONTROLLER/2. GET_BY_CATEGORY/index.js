const { executeQuery } = require("../../../DATABASE");

const GET_ALL_BY_CATEGORY_PRODUCT = async (req, res) => {
    try 
    {
        const {category} = req.params;

        let { page = 1 , itemsPerPage = 5 } = req.query;
        const offset = (page - 1) * itemsPerPage;

        const query = `
                SELECT 
                p.id,
                c.name AS category_name,
                p.product_name,
                p.short_desc,
                p.desc,
                p.price,
                p.img_url,
                p.create_date,
                IFNULL(AVG(r.rating), 0) AS rating,
                u.username,
                u.profile_img,
                COUNT(review.id) AS review_count 
                FROM products p
                LEFT JOIN product_ratings r ON p.id = r.product
                LEFT JOIN users u ON p.user = u.id
                LEFT JOIN categories c ON p.category = c.id
                LEFT JOIN product_reviews review ON p.id = review.product
                WHERE c.id = ?
                GROUP BY p.id ORDER BY p.create_date DESC
                LIMIT ?, ?;`
        

        const data = await executeQuery(query, [category, offset.toString(), itemsPerPage]);


        if(data.length === 0) 
        {
            return res.status(404).json({
                success:false,
                data: null,
                message: "Хуудас олдсонгүй"
            })
        }


        const countQuery = `
        SELECT COUNT(*) AS total_products
        FROM products p
        LEFT JOIN categories c ON p.category = c.id
        WHERE c.id = ?;
    `;
        const totalCountResult = await executeQuery(countQuery, [category]);
        const totalCount = totalCountResult[0].total_products;
        const maxPage = Math.ceil(totalCount / itemsPerPage);


        return res.status(200).json({
            success: true,
            data: data,
            maxPage: maxPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            totalCount: totalCount,
        });



    }   
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: null,
            message: "Серверийн алдаа"
        })
    }
}

module.exports = GET_ALL_BY_CATEGORY_PRODUCT