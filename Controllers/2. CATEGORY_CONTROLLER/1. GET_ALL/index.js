const {executeQuery} = require("../../../Database/test")

const GET_ALL_CATEGORY = async (req, res) => {
    try 
    {
        const query = "SELECT * FROM category"

        const data = await executeQuery(query)

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message:"Өгөгдөл олдсонгүй"
            })
        }

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
            message: "Серверийн алдаа гарлаа : " + err 
        })
    }
}

module.exports = GET_ALL_CATEGORY