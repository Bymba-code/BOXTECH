const { executeQuery } = require("../../../DATABASE");

const GET_BY_CATEGORY = async (req, res) => {
    try {
        
        const { categoryName } = req.params;

        const {page, limit } = req.query;

        const offset = (page - 1) * limit

        const query = `
            SELECT * from products limit ? offset ?
        `;
        const data = await executeQuery(query)
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
