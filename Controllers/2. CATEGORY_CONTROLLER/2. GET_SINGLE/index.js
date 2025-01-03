const {executeQuery} = require("../../../Database/test")

const GET_SINGLE_CATEGORY = async (req, res) => {
    try 
    {
        const {categoryId} = req.params;

        if(!categoryId)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Сонгох төрлийн ID байхгүй байна."
            })
        }

        const query = `SELECT * FROM category WHERE id = ?`

        const data = await executeQuery(query, [categoryId])

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Хайсан төрөл олдсонгүй."
            })
        }

        return res.status(200).json({
            success:true,
            data:data,
            message:"Амжилттай"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа : " + err 
        })
    }
}

module.exports = GET_SINGLE_CATEGORY