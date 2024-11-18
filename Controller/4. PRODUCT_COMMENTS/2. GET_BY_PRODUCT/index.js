const { executeQuery } = require("../../../DATABASE");

const GET_COMMENT_BY_PRODUCT = async (req, res) => {

    try 
    {
        const {product} = req.params;

        const query = `SELECT 
        product_comments.id,
        product_comments.product,
        product_comments.title, 
        product_comments.comment, 
        product_comments.create_date,
        products.product_name AS product_name,  
        users.username AS user_name, 
        users.profile_img AS user_profile_img
        FROM product_comments
        INNER JOIN users ON users.id = product_comments.user
        INNER JOIN products ON products.id = product_comments.product
        WHERE product_comments.product = ?
        `

        const data = await executeQuery(query, [product])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: null,
                message: "Коммент бичигдээгүй байна"
            })
        }

        return res.status(200).json({
            success:true,
            data: data,
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

module.exports = GET_COMMENT_BY_PRODUCT