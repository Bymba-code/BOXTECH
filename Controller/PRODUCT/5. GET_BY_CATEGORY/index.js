const { executeQuery } = require("../../../DATABASE");

const GET_BY_CATEGORY = async (req, res) => {
    try {
        const { categoryName } = req.params;
        const { page = 2, pageSize = 10 } = req.query; // Get page and pageSize from query params

        const offset = (page - 1) * pageSize;

        // Query to get paginated products
        const query = `
            SELECT p.id, p.product_name, p.price, p.category_name, AVG(pr.rating) AS rating
            FROM products p
            LEFT JOIN product_rating pr ON p.id = pr.product_id
            WHERE p.category_name = ?
            GROUP BY p.id, p.product_name, p.price, p.category_name
            ORDER BY p.product_name
            LIMIT ? OFFSET ?
        `;
        
        const data = await executeQuery(query, [categoryName, pageSize, offset]);

        // Query to count the total number of products
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM products p
            WHERE p.category_name = ?
        `;
        
        const countData = await executeQuery(countQuery, [categoryName]);
        const totalItems = countData[0].total;

        // Calculate total number of pages
        const totalPages = Math.ceil(totalItems / pageSize); // Round up the division result

        // If no products are found
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Сонгосон төрөлд файл байхгүй байна."
            });
        } else {
            return res.status(200).json({
                success: true,
                data: data,
                totalItems: totalItems,
                totalPages: totalPages, // Add totalPages in the response
                message: "Амжилттай"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
            error: err.message || err
        });
    }
};

module.exports = GET_BY_CATEGORY;
