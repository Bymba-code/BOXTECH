const {executeQuery} = require("../../../Database/test")

const COMMENT_NEWS = async (req, res) => {
    try 
    {
        const {id} = req.params;
        const query = `SELECT * FROM news_comments WHERE news = ?`

        const data = await executeQuery(query, [id])

        return res.status(200).json({
            success:false,
            data:data,
            message: "Амжилттай"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа гарлаа" + err
        })
    }
}

module.exports = COMMENT_NEWS 