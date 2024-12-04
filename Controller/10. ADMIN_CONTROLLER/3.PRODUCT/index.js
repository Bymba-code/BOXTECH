const {executeQuery} = require("../../../DATABASE/index")

const PRODUCT_ADMIN = async (req, res) => {
    try 
    {
        const {page = 1, item = 5, category = "", rating = "", order = "", soldSort} = req.query;
        const offset = (page - 1) * item


        const sort = "ASC"

        let whereConditions = [];
        const queryParams = [offset.toString(), item];

        let orderClause = ""

        if(order === "ASCPRICE" || order === "DESCPRICE")
        {
            orderClause = `ORDER BY total_sold ${order === "ASCPRICE" ? "ASC" : order === "DESCPRICE" ? "DESC" : ""}`
        }
        if(order === "ASC" || order === "DESC")
        {
            orderClause = `ORDER BY p.price ${order}`

        }
        if (category) {
            whereConditions.push("c.name = ?");
            queryParams.unshift(category); 

        }

        if (rating) {
            whereConditions.push("pr.rating = ?");
            queryParams.unshift(rating); 
        }

        let whereClause = "";
        if (whereConditions.length > 0) {
            whereClause = "WHERE " + whereConditions.join(" AND ");
        }

        const query = `SELECT 
                        p.img_url,
                        p.id,
                        p.product_name,
                        u.username,
                        p.price,
                        COUNT(ps.id) AS total_sold,
                        c.name,
                        AVG(pr.rating) AS rating,
                        COUNT(product_reviews.id) as reviews
                        FROM 
                        users AS u
                        JOIN products p ON p.user = u.id
                        LEFT JOIN product_sell ps ON ps.product = p.id
                        LEFT JOIN categories c ON c.id = p.category
                        LEFT JOIN product_ratings pr ON pr.product = p.id
                        LEFT JOIN product_reviews ON product_reviews.product = p.id
                        ${whereClause}
                        GROUP BY 
                        p.id, u.username, p.price
                        ${orderClause}
                        LIMIT ? , ?
                        `
        const products = await executeQuery(query , queryParams)
        
        const countQuery = ` SELECT COUNT(DISTINCT p.id) AS total_products
            FROM 
                users AS u
            JOIN products p ON p.user = u.id
            LEFT JOIN product_sell ps ON ps.product = p.id
            LEFT JOIN categories c ON c.id = p.category
            LEFT JOIN product_ratings pr ON pr.product = p.id
            LEFT JOIN product_reviews ON product_reviews.product = p.id
            ${whereClause};`;
        const countParams = queryParams.slice(0, whereConditions.length); 
        const totalCountResult = await executeQuery(countQuery, countParams);
        const totalCount = totalCountResult[0].total_products;

        const maxPage = Math.ceil(totalCount / item);

        if(products.length > 0)
        {
            return res.status(200).json({
                success: true,
                data: products,
                maxPage: maxPage,
                currentPage: page,
                itemsPerPage: item,
                totalCount:totalCount,
                message: "Амжилттай"
            });
        }
        return res.status(404).json({
            success:false,
            data: null,
            message: "Хуудас олдсонгүй"
        })
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

module.exports = PRODUCT_ADMIN