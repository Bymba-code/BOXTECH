const { executeQuery } = require("../../../DATABASE");

const GET_SINGLE_PRODUCT = async (req, res) => {
    
    try 
    {
        const {id} = req.params

        if(!id)
        {
            return res.status(404).json({
                success:false,
                data: null,
                message: "Файлын ID-г оруулна уу"
            })
        }

        const query = `SELECT 
                p.id,
                c.name AS category_name,
                p.product_name,
                p.short_desc,
                p.desc,
                p.price,
                p.img_url,
                p.create_date,
                IFNULL(AVG(r.rating), 0) AS rating,
                u.username,
                u.profile_img,
                COUNT(review.id) AS review_count
            FROM products p
            LEFT JOIN product_ratings r ON p.id = r.product
            LEFT JOIN users u ON p.user = u.id
            LEFT JOIN categories c ON p.category = c.id
            LEFT JOIN product_reviews review ON p.id = review.product
            WHERE p.id = ?
            GROUP BY p.id
            ORDER BY p.create_date DESC`

        const data = await executeQuery(query, [id])

        if(data.length === 0) 
        {
            return res.status(404).json({
                success:false,
                data: null,
                message: "Файл олдсонгүй"
            })
        }

        return res.status(200).json({
            success:true,
            data:data[0],
            message: "Амжилттай"
        })
        
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: null,
            message: "Серверийн алдаа"
        })
    }

}

module.exports = GET_SINGLE_PRODUCT