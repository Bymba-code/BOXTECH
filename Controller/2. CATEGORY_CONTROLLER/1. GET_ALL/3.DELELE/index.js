const { executeQuery } = require("../../../DATABASE/index");


const DELETE_CATEGORY = async (req, res) => {
    try 
    {
        const {id} = req.params;

        const query = "DELETE FROM categories WHERE id = ?"

        const data = await executeQuery(query, [id])

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
        return res.status(500).json({
            success:false,
            data:null,
            message:"Серверийн алдаа" + err
        })
    }
}

module.exports = DELETE_CATEGORY