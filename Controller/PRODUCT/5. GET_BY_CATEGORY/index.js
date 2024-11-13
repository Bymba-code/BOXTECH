const {executeQuery} = require("../../../DATABASE")

const GET_BY_CATEGORY = async (req, res) => {
    try 
    {
        const {categoryName} = req.params;

        const query = "SELECT * FROM products WHERE category_name = ?"
        
        const data = await executeQuery(query, [categoryName])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false, 
                data: null,
                message: "Төрлөөр шүүлт амжилтгүй."
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

module.exports = GET_BY_CATEGORY