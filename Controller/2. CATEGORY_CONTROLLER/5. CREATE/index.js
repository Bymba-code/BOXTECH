const { executeQuery } = require("../../../DATABASE/index");

const CREATE_CATEGORY = async (req, res) => {
    try 
    {
        const {createName} = req.body;

        const query = "INSERT INTO categories (`name`) VALUE (?)"

        const data = await executeQuery(query, [createName])

        if(data.affectedRows > 0)
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
            success:false,
            data:null,
            message:"Серверийн алдаа" + err
        })
    }
}

module.exports = CREATE_CATEGORY