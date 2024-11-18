const { executeQuery } = require("../../../DATABASE");

const DELETE_COMMENT = async (req, res) => {
    try {
        const { product, user, commentId } = req.body;

        if (!commentId || !user || !product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Талбарууд хоосон байна"
            });
        }

        const getQuery = "SELECT * FROM product_comments WHERE id = ? AND product = ?";
        const data = await executeQuery(getQuery, [commentId, product]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Коммент олдсонгүй"
            });
        }

        if (user !== data[0].user) {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Танд хандах эрх байхгүй"
            });
        }

        const deleteQuery = "DELETE FROM product_comments WHERE id = ?";
        const deleteResult = await executeQuery(deleteQuery, [commentId]);

        return res.status(200).json({
            success: true,
            data: deleteResult,
            message: "Comment successfully deleted"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Server error"
        });
    }
};

module.exports = DELETE_COMMENT;
