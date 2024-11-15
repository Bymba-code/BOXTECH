const {executeQuery} = require("../../../DATABASE")

const GET_SINGLE_CATEGORY = async (req, res) => {
    try 
    {
        const {name} = req.params;

        const query = "SELECT * FROM categories WHERE name = ? "
        
        const data = await executeQuery(query, [name])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false, 
                data: null,
                message: "Таны хайсан төрөл байхгүй эсвэл устсан байна."
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

module.exports = GET_SINGLE_CATEGORY