const {executeQuery} = require("../../../DATABASE/index")


const GET_ALL_PRODUCT = async (req, res) => {
    try 
    {
        const query = "SELECT * FROM products"
        
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