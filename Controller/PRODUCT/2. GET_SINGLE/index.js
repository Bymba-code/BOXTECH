const { executeQuery } = require("../../../DATABASE");

const GET_BY_CATEGORY = async (req, res) => {
    try {

        const {id} = req.params;

        const query = `SELECT p.id, p.product_name, p.price, p.category_name, AVG(pr.rating) AS rating 
                       FROM products p 
                       LEFT JOIN product_rating pr ON p.id = pr.product_id 
                       WHERE p.id = ? 
                       GROUP BY p.id, p.product_name, p.price, p.category_name
                       `

        const data = await executeQuery(query, [id])

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Сонгосон төрөлд файл байхгүй байна." // No products found for selected category
            });
        } else {
            return res.status(200).json({
                success: true,
                data: data,
                maxPages: maxPages, // Add the maxPages to the response
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
