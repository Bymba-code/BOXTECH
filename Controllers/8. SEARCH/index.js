const { executeQuery } = require("../../../Database/test");

const SEARCH_PRODUCTS = async (req, res) => {
    try {
        const { category, search } = req.params;

        // Define the query with placeholders for parameterized values
        const query = `
            SELECT 
                products.*,
                category.name AS category_name,
                users.id AS owner_id,
                users.username,
                COUNT(DISTINCT product_reviews.id) AS review_count,
                AVG(product_rating.rating) AS average_rating
            FROM 
                products
            LEFT JOIN 
                category ON category.id = products.category
            LEFT JOIN 
                users ON products.user = users.id
            LEFT JOIN 
                product_reviews ON products.id = product_reviews.product
            LEFT JOIN 
                product_rating ON products.id = product_rating.product
            WHERE 
                products.category = ? AND 
                product_name LIKE ? 
            GROUP BY 
                products.id, category.name, users.id`;

        const result = await executeQuery(query, [category, `%${search}%`]);

        // Check if results exist
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                data: result,
                message: "Products found successfully"
            });
        } else {
            return res.status(404).json({
                success: false,
                data: [],
                message: "No products found"
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Server error: " + err
        });
    }
};

module.exports = SEARCH_PRODUCTS;
