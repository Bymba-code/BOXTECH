const { default: axios } = require("axios");
const { executeQuery } = require("../../../Database/test");

const GET_COMMENT_NEWS = async (req, res) => {
    try {
        const { page = 1, size = 5 } = req.query;
        const { id } = req.params;

        const pageInt = parseInt(page, 10);
        const sizeInt = parseInt(size, 10);
        const offset = (pageInt - 1) * sizeInt;

        const countQuery = `SELECT COUNT(*) as total FROM news_comments WHERE news = ?`;
        const countResult = await executeQuery(countQuery, [id]);
        const totalRows = countResult[0]?.total || 0;

        const maxPages = Math.ceil(totalRows / sizeInt);

        const query = ` SELECT news_comments.*, users.username 
                        FROM news_comments 
                        LEFT JOIN users ON news_comments.user = users.id 
                        WHERE news_comments.news = ? 
                        LIMIT ? OFFSET ?;`;
        const data = await executeQuery(query, [id, sizeInt.toString(), offset.toString()]); 

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Өгөгдөл олдсонгүй"
            });
        }

        return res.status(200).json({
            success: true,
            data: data,
            message: "Амжилттай",
            pagination: {
                currentPage: pageInt,
                pageSize: sizeInt,
                totalRows: totalRows,
                maxPages: maxPages
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа " + err
        });
    }
};

module.exports = GET_COMMENT_NEWS
