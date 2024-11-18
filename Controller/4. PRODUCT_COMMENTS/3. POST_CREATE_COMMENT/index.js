const { executeQuery } = require("../../../DATABASE");

const POST_CREATE_COMMENT = async (req, res) => {
    try {
        const { product, user, title, comment } = req.body;

        if (!product) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Файл ID байхгүй"
            });
        }
        if (!user) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Нэвтэрнэ үү"
            });
        }

        const query = `SELECT * FROM users WHERE id = ?`;
        const checkQuery = await executeQuery(query, [user]);

        if (checkQuery.length === 0) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Идэвхгүй хэрэглэгч"
            });
        }

        if (!title) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Комментийн гарчиг хоосон байна"
            });
        }
        if (!comment) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Коммент хоосон байна"
            });
        }

        const values = [user, product, title, comment, new Date()];

        const insertQuery = `
            INSERT INTO product_comments (user, product, title, comment, create_date)
            VALUES (?, ?, ?, ?, ?)
        `;

        const data = await executeQuery(insertQuery, values);

        if (data.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                data: data,
                message: "Амжилттай нэмлээ"
            });
        } else {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Коммент нэмэгдсэнгүй"
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа"
        });
    }
};

module.exports = POST_CREATE_COMMENT;
