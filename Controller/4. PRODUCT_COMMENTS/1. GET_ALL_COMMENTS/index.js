const { executeQuery } = require("../../../DATABASE");

const GET_ALL_COMMENT = async (req, res) => {
    try 
    {
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
                

        `

        
        const data = await executeQuery(query)

        return res.status(200).json({
            success:true,
            data: data,
            message:"Амжилттай"
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

module.exports = GET_ALL_COMMENT