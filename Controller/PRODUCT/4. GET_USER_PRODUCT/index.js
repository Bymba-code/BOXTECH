const {executeQuery} = require("../../../DATABASE")

const GET_PRODUCTS_USERNAME = async (req, res) => {
    try 
    {
        const {username} = req.params;

        const query = "SELECT * FROM products WHERE username = ? "
        
        const data = await executeQuery(query, [username])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false, 
                data: null,
                message: "Хоосон."
            })
        }
        else 
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

module.exports = GET_PRODUCTS_USERNAME