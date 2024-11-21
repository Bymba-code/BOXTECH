const { executeQuery } = require("../../../DATABASE");

const GET_COMMENT_BY_PRODUCT = async (req, res) => {
    try {
        const { product } = req.params;
        const { page = 1, item = 10 } = req.query; 
        const offset = (page - 1) * item; 

        const query = `
            SELECT 
                product_comments.id,
                product_comments.product,
                product_comments.title, 
                product_comments.comment, 
                product_comments.create_date,
                products.product_name AS product_name,  
                users.username AS user_name, 
                users.profile_img AS user_profile_img
            FROM product_comments
            INNER JOIN users ON users.id = product_comments.user
            INNER JOIN products ON products.id = product_comments.product
            WHERE product_comments.product = ?
            LIMIT ? OFFSET ?
        `;

        // Execute query with proper numeric values
        const data = await executeQuery(query, [product, item, offset.toString()]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Коммент бичигдээгүй байна",
            });
        }

        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM product_comments 
            WHERE product_comments.product = ?
        `;
        const countResult = await executeQuery(countQuery, [product]);
        const totalComments = countResult[0]?.total || 0;

        return res.status(200).json({
            success: true,
            data: data,
            pagination: {
                totalComments,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalComments / item),
                limit: parseInt(item),
            },
            message: "Амжилттай",
        });

    } catch (err) {
        console.error(err); // Log error for debugging
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
        });
    }
};

module.exports = GET_COMMENT_BY_PRODUCT;
