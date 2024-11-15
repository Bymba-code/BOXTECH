const { executeQuery } = require("../../../DATABASE");

const GET_SINGLE_PRODUCT = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `SELECT p.*,
                              AVG(pr.rating) AS rating 
                       FROM products p 
                       LEFT JOIN product_rating pr ON p.id = pr.product_id 
                       WHERE p.id = ? 
                       GROUP BY p.id, p.product_name, p.price, p.category_name`;

        const data = await executeQuery(query, [id]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Сонгосон бүтээгдэхүүн олдсонгүй." 
            });
        }

        return res.status(200).json({
            success: true,
            data: data[0], 
            message: "Амжилттай" 
        });

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

module.exports = GET_SINGLE_PRODUCT;
