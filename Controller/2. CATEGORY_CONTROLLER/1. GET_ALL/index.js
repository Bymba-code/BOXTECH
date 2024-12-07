const { executeQuery } = require("../../../DATABASE/index");


const GET_ALL_CATEGORY = async (req, res) => {
    try 
    {
        const query = 'SELECT * FROM categories'

        const data = await executeQuery(query)

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
            message:"Серверийн алдаа" + err
        })
    }
}

module.exports = GET_ALL_CATEGORY