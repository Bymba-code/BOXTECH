const {executeQuery} = require("../../../DATABASE/index")

const CATEGORY_ADMIN = async (req, res) => {
    try 
    {
       const query = `SELECT 
                c.id AS category_id,
                c.name AS category_name,
                COUNT(DISTINCT p.id) AS total_products,
                COUNT(ps.id) AS total_sales
            FROM 
                categories c
            LEFT JOIN 
                products p ON c.id = p.category
            LEFT JOIN 
                product_sell ps ON ps.product = p.id
            GROUP BY 
                c.id, c.name;
`
    const data = await executeQuery(query)
    
    if(data)
    {
        return res.status(200).json({
            success:true,
            data:data,
            message: "Амжилттай"
        })
    }

    
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа" + err
        })
    }
}

module.exports = CATEGORY_ADMIN 