const {executeQuery} = require("../../../Database/test")

const GET_SINGLE_PRODUCT = async (req, res) => {
    try 
    {

        const {productId} = req.params

        if(!productId)
        {
            return res.status(403).json({
                success:false,
                data:[],
                message: "Мэдээлэл дутуу байна."
            })
        }
    
        const query =  `SELECT 
                        products.*,
                        users.id AS owner_id,
                        users.username,
                        category.name AS category_name,
                        COUNT(product_reviews.id) AS review_count,
                        AVG(product_rating.rating) AS average_rating
                        FROM 
                        products
                        LEFT JOIN 
                        users ON products.user = users.id
                        LEFT JOIN 
                        product_reviews ON products.id = product_reviews.product
                        LEFT JOIN 
                        product_rating 
                        ON 
                        products.id = product_rating.product
                        LEFT JOIN category ON category.id = products.category
                        WHERE products.id = ?
                        GROUP BY 
                        products.id, users.id, users.username
                        `
        const data = await executeQuery(query, [productId])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message:"Сонгосон файл устарсан эсвэл байхгүй байна."
            })
        }

        const insertReviews = "INSERT INTO product_reviews (`product`) VALUES (?)"
        const reviews = await executeQuery(insertReviews, [data[0].id])

        if(reviews.affectedRows === 0) 
        {
            return res.status(404).json({
                success:false, 
                data: [],
                message: "Ямар нэгэн алдаа гарлаа."
            })
        }

        return res.status(200).json({
            success:true,
            data:data,
            message: "Амжилттай"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа : " + err 
        })
    }
}

module.exports = GET_SINGLE_PRODUCT