const { executeQuery } = require("../../../DATABASE/index");

const RECENT_ORDER = async (req, res) => {
    try {
        let {page = 1 , items = 5} = req.query;
        const offset = (page - 1) * items;

        console.log(offset, items)

        const query = `
            SELECT 
                checkouts.id,
                users.username AS checkout_user,
                products.product_name, 
                products.price,
                statement.withdraw,
                statement.deposit,
                product_users.username AS product_user,
                qpay_invoice.date
                FROM 
                checkouts
                LEFT JOIN products ON products.id = checkouts.product
                LEFT JOIN users ON users.id = checkouts.user
                LEFT JOIN qpay_invoice ON qpay_invoice.checkout_id = checkouts.id
                LEFT JOIN statement ON statement.checkout_id = checkouts.id
                LEFT JOIN users AS product_users ON product_users.id = products.user
                WHERE qpay_invoice.payment = 1
                LIMIT ?, ?;`;

        const data = await executeQuery(query, [offset.toString(), items.toString()]);

        const countQuery = `
            SELECT COUNT(*) AS total_products
            FROM checkouts
            LEFT JOIN qpay_invoice ON qpay_invoice.checkout_id = checkouts.id
            WHERE qpay_invoice.payment = 1;`;

        const totalCountResult = await executeQuery(countQuery);
        const totalCount = totalCountResult[0].total_products;
        const maxPage = Math.ceil(totalCount / items);

        return res.status(200).json({
            success: true,
            data: data,
            totalCount: totalCount,
            maxPage: maxPage,
            currentPage: page,
            itemsPerPage: items,
            message: "Амжилттай",
        });
    } catch (err) {
        console.error("RECENT_ORDER Error:", err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа: " + err.message,
        });
    }
};

module.exports = RECENT_ORDER;
