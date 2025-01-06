const { executeQuery } = require("../../../Database/test");

const GET_NEWS = async (req, res) => {
    try {
        const { page, size, category } = req.query;
        const pageInt = parseInt(page, 10);
        const sizeInt = parseInt(size, 10);

        if (!category && !page && !size) {
            const allNewsQuery = `
                SELECT 
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
                GROUP BY news.id
                ORDER BY news.date DESC
            `;
            const allNews = await executeQuery(allNewsQuery);
            
            if (allNews.length === 0) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: "Мэдээ олдсонгүй"
                });
            }

            return res.status(200).json({
                success: true,
                data: allNews,
                message: "Амжилттай"
            });
        }

        // Otherwise, apply pagination with category filtering
        const offset = (pageInt - 1) * sizeInt;

        const countQuery = `
            SELECT COUNT(DISTINCT news.id) AS total 
            FROM news
            LEFT JOIN news_reviews ON news.id = news_reviews.news
            LEFT JOIN news_comments ON news.id = news_comments.news
            WHERE news.category = ?
        `;
        const countResult = await executeQuery(countQuery, [category]);
        const totalRows = countResult[0]?.total || 0;

        const query = `
            SELECT 
            news.id AS news_id,
            news.img_url,
            news.title,
            news.category,
            news.description,
            news.date,
            COUNT(DISTINCT news_reviews.id) AS review_count, 
            COUNT(DISTINCT news_comments.id) AS comment_count ,
            news_category.*
            FROM news
            LEFT JOIN news_reviews ON news.id = news_reviews.news
            LEFT JOIN news_comments ON news.id = news_comments.news
            LEFT JOIN news_category ON news.category = news_category.id
            WHERE news.category = ?
            GROUP BY news.id
            ORDER BY news.date DESC
            LIMIT ? OFFSET ?
        `;
        const data = await executeQuery(query, [category, sizeInt.toString(), offset.toString()]);

        const maxPages = Math.ceil(totalRows / sizeInt);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Мэдээ олдсонгүй"
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
            message: "Серверийн алдаа гарлаа: " + err
        });
    }
};

module.exports = GET_NEWS;
