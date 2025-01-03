const {executeQuery} = require("../../../Database/test")

const DELETE_CATEGORY = async (req , res) => {
    try 
    {
        const {id} = req.body;

        if(!id)
        {
            return res.status(403).json({
                    success:false,
                    data: [],
                    message: "Устгах төрлийн мэдээлэл байхгүй байна."
            })
        }

        const checkQuery = "SELECT * FROM category WHERE id = ?"
        const check = await executeQuery(checkQuery, [id])

        if(check.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Устгах төрөл олдсонгүй"
            })
        }

        const deleteQuery = "DELETE FROM category WHERE id = ?"
        const data = await executeQuery(deleteQuery, [id])

        if(data.affectedRows === 0)
        {
            return res.status(402).json({
                success:false,
                data: [],
                message: "Төрлийг устгахад алдаа гарлаа"
            })
        }

        return res.status(200).json({
            success:true,
            data: [],
            message: "Төрлийг амжилттай устгалаа"
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

module.exports = DELETE_CATEGORY