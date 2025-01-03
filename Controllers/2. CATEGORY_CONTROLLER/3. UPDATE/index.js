const {executeQuery} = require("../../../Database/test")

const UPDATE_CATEGORY = async (req, res) => {
    try 
    {
        const {id, updateName} = req.body;

        if(!id)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Шинэчлэх төрлийн мэдээлэл байхгүй байна."
            })
        }
        if(!updateName)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Шинэчлэх нэрийг оруулна уу."
            })
        }

        const checkQuery = `SELECT * FROM category WHERE id = ?`
        const check = await executeQuery(checkQuery, [id])

        if(check.length === 0)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message:"Сонгосон төрөл олдсонгүй."
            })
        }

        const checkNameQuery = `SELECT * FROM category WHERE name = ?`
        const checkName = await executeQuery(checkNameQuery, [updateName])

        if(checkName.length > 0)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: `${updateName} нэртэй төрөл байна.`
            })
        }

        const updateQuery = "UPDATE category SET name = ? WHERE id = ?"
        const data = await executeQuery(updateQuery, [updateName, id])

        if(data.affectedRows === 0)
        {
            return res.status(405).json({
                success:false,
                data: [],
                message: "Төрлийг шинэчлэхэд алдаа гарлаа."
            })
        }
        
        return res.status(200).json({
            success:true,
            data: data,
            message: "Амжилттай"
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

module.exports = UPDATE_CATEGORY