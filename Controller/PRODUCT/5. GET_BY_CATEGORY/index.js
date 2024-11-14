const { executeQuery } = require("../../../DATABASE");

const GET_BY_CATEGORY = async (req, res) => {
    try {
        const { categoryName } = req.params;
        let { page, limit } = req.query;

        // Set default values for page and limit if not provided or invalid
        page = parseInt(page) || 1;  // Default to page 1 if not provided or invalid
        limit = parseInt(limit) || 10;  // Default to limit 10 if not provided or invalid

        // Calculate the offset based on the current page
        const offset = (page - 1) * limit;

        // Construct the query
        const query = `SELECT * FROM products WHERE category_name = 'Програм хангамж' LIMIT 10 OFFSET 1`;

        // Execute the query with the category name, limit, and offset
        const data = await executeQuery(query, [categoryName, limit, offset]);

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

module.exports = GET_BY_CATEGORY;
