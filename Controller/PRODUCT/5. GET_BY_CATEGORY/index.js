const { executeQuery } = require("../../../DATABASE");

const GET_BY_CATEGORY = async (req, res) => {
    try {
        const { categoryName } = req.params;

        // Get page number from query parameters, default to 1 if not provided
        const page = parseInt(req.query.page) || 1; 
        const limit = 10;  // Fixed limit (always 10 items per page)
        const offset = (page - 1) * limit;  // Calculate the offset

        // Ensure the page number is a valid positive integer
        if (isNaN(page) || page <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid page number."
            });
        }

        // Logging the parameters for debugging
        console.log(`Executing query with parameters: [ ${categoryName}, ${limit}, ${offset} ]`);

        // Query to get the products for the specific category with pagination
        const query = `
            SELECT p.id, p.product_name, p.price, p.category_name, AVG(pr.rating) AS rating
            FROM products p
            LEFT JOIN product_rating pr ON p.id = pr.product_id
            WHERE p.category_name = ?
            GROUP BY p.id, p.product_name, p.price, p.category_name
            ORDER BY p.product_name
            LIMIT ? OFFSET ?
        `;

        // Get the paginated products
        const data = await executeQuery(query, [categoryName, limit, offset]);

        // Query to count the total number of items (products) in the category
        const countQuery = "SELECT COUNT(*) AS total FROM products WHERE category_name = ?";
        const countResult = await executeQuery(countQuery, [categoryName]);
        const totalItems = countResult[0].total;  // Total number of products

        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limit);  // Round up to the nearest page

        // If no products are found
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "No products found for this category."
            });
        } else {
            return res.status(200).json({
                success: true,
                data: data,
                pagination: {
                    currentPage: page,
                    totalItems: totalItems,
                    totalPages: totalPages,
                    itemsPerPage: limit
                },
                message: "Products fetched successfully."
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Server error.",
            error: err.message || err
        });
    }
};

module.exports = GET_BY_CATEGORY;
