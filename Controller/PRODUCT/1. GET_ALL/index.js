const { executeQuery } = require("../../../DATABASE/index");

const GET_ALL_PRODUCT = async (req, res) => {
    try {
        // Get pagination parameters from query string (with default values)
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page
        const offset = (page - 1) * limit;  // Calculate the offset for the query

        // SQL query to get paginated products with average rating
        const query = `
            SELECT p.*, AVG(pr.rating) AS rating 
            FROM products p
            LEFT JOIN product_rating pr ON p.id = pr.product_id
            GROUP BY p.id, p.product_name, p.price
            LIMIT ? OFFSET ?
        `;

        // Execute the query
        const data = await executeQuery(query, [limit, offset]);

        if (data) {
            const countQuery = "SELECT COUNT(*) AS total FROM products";
            const countResult = await executeQuery(countQuery);
            const totalItems = countResult[0].total;
            const totalPages = Math.ceil(totalItems / limit);

            return res.status(200).json({
                success: true,
                data: data,
                message: "Амжилттай",
                pagination: {
                    currentPage: page,
                    totalItems: totalItems,
                    totalPages: totalPages,
                    itemsPerPage: limit
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Үр дүн олдсонгүй"
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
            error: err.message || err
        });
    }
};

module.exports = GET_ALL_PRODUCT;
