const {executeQuery} = require("../../../Database/test")

const GET_SINGLE_NEWS = async (req, res) => {
    try 
    {
        const {id} = req.params;
        
        const query = ` SELECT 
                        news.id AS news_id,
                        news.img_url,
                        news.title,
                        news.category,
                        news.description,
                        news.date,
                        COUNT(DISTINCT news_reviews.id) AS review_count, 
                        COUNT(DISTINCT news_comments.id) AS comment_count,
                        news_category.*
                        FROM news
                        LEFT JOIN news_reviews ON news.id = news_reviews.news
                        LEFT JOIN news_comments ON news.id = news_comments.news
                        LEFT JOIN news_category ON news_category.id = news.category
                        WHERE news.id = ?
                        GROUP BY news.id
                        `
        
        const data = await executeQuery(query, [id])

        return res.status(200).json({
            success:false,
            data: data,
            message: "Амжилтаай"
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

module.exports = GET_SINGLE_NEWS