const {executeQuery} = require("../../../DATABASE/index")


const GET_FAVOUTIRES = async (req, res) => {
    try 
    {
        const {userId} = req.params;
        const selectQuery = `
                            SELECT 
                            uf.*,
                            p.*,
                            IFNULL(AVG(pr.rating), 0) AS rating,
                            COUNT(product_reviews.id) AS review_count,
                            categories.name AS category_name
                        FROM 
                            user_favourite AS uf
                        LEFT JOIN 
                            products AS p ON uf.product = p.id
                        LEFT JOIN 
                            categories ON p.category = categories.id
                        LEFT JOIN 
                            product_ratings AS pr ON pr.product = p.id
                        LEFT JOIN 
                            product_reviews ON p.id = product_reviews.product
                        WHERE 
                            uf.user = ?
                        GROUP BY 
                            uf.id, p.id ,categories.id;
                        ; 

                            `

        const data = await executeQuery(selectQuery, [userId])

        if(data.length > 0)
        {
            return res.status(200).json({
                success:true,
                data:data,
                message: "Амжилттай"
            })
        }
        else 
        {
            return res.status(404).json({
                success:false,
                data:data,
                message: "Танд хадгалсан файл байхгүй байна."
            })
        }



    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: null,
            message: "Серверийн алдаа" + err
        })
    }
}

module.exports = GET_FAVOUTIRES