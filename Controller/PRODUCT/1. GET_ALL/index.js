const {executeQuery} = require("../../../DATABASE/index")


const GET_ALL_PRODUCT = async (req, res) => {
    try 
    {
        const query = "SELECT p.*, AVG(pr.rating) AS rating FROM  products p LEFT JOIN product_rating pr ON p.id = pr.product_id GROUP BY p.id, p.product_name, p.price"
        
        const data = await executeQuery(query)

        if(data)
        {
            return res.status(200).json({
                success:true, 
                data: data,
                message: "Амжилттай"
            })
        }
    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
            error: err.message || err
        });
    }
}

module.exports = GET_ALL_PRODUCT 
