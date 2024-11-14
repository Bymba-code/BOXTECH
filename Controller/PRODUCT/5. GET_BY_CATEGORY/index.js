const { executeQuery } = require("../../../DATABASE");

const GET_BY_CATEGORY = async (req, res) => {
    try {
        const { categoryName } = req.params;
        let { page, limit } = req.query;

        // Set default values for page and limit if not provided or invalid
        page = page || 1; 
        limit = limit || 10;  

        const countQuery = `SELECT COUNT(*) AS totalCount FROM products p WHERE p.category_name = ?`;
        const countResult = await executeQuery(countQuery, [categoryName]);
        const totalCount = countResult[0].totalCount;

        const maxPages = Math.ceil(totalCount / limit);

        
        // Construct the query
        const query = "SELECT p.id, p.product_name, p.price, p.category_name, AVG(pr.rating) AS rating FROM products p LEFT JOIN product_rating pr ON p.id = pr.product_id WHERE p.category_name = ? GROUP BY p.id, p.product_name, p.price, p.category_name ORDER BY p.product_name LIMIT ? OFFSET ?"

        // Execute the query with the category name, limit, and offset
        const data = await executeQuery(query, [categoryName, limit, page]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Сонгосон төрөлд файл байхгүй байна." // No files found for selected category
            });
        } else {
            return res.status(200).json({
                success: true,
                data: data,
                totalCount: totalCount,
                maxPages: maxPages,
                message: "Амжилттай" // Success
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа", // Server error
            error: err.message || err
        });
    }
};

module.exports = GET_BY_CATEGORY
