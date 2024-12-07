const { executeQuery } = require("../../../DATABASE/index");

const UPDATE_CATEGORY = async (req, res) => {
    try 
    {
        const {id, updateName} = req.body;

        const query = "SELECT * FROM categories WHERE id = ?"

        const category = await executeQuery(query, [id])

        if(category.length === 0)
        {
            return res.status({
                success:false,
                data: null,
                message: "Таны хайсан ангилал устсан эсвэл байхгүй байна"
            })
        }
        const updateQuery = "UPDATE categories SET name = ?"

        const data = await executeQuery(updateQuery, [updateName])

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

module.exports = UPDATE_CATEGORY