const { executeQuery } = require("../../../DATABASE/index");

const USERS_ADMIN = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit; 

        const query = `
            SELECT 
                users.*,
                COUNT(DISTINCT p.id) AS total_products, 
                COUNT(ps.id) AS total_sells
            FROM 
                users
            LEFT JOIN 
                products p ON users.id = p.user
            LEFT JOIN 
                product_sell ps ON p.id = ps.product
            GROUP BY 
                users.id
            LIMIT ${limit} OFFSET ${page}
        `;

        const data = await executeQuery(query);

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "No users found"
            });
        }

        const countQuery = `SELECT COUNT(*) AS total FROM users`;
        const totalCountResult = await executeQuery(countQuery);

        if (!totalCountResult || totalCountResult.length === 0) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Unable to fetch total count of users"
            });
        }

        const totalCount = totalCountResult[0]?.total || 0;

        return res.status(200).json({
            success: true,
            data: data,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
            message: "Амжилттай"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: `Серверийн алдаа гарлаа: ${err.message}`
        });
    }
};

module.exports = USERS_ADMIN;
