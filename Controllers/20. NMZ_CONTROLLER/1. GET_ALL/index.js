const {executeQuery} = require("../../../Database/test")


const GET_ALL_NMZ = async (req , res) => {
    try 
    {
        const query = "SELECT * FROM NMZ"

        const data = await executeQuery(query)
        
        return res.status(200).json({
            success:true,
            data:data,
            message: ""
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа"
        })
    }
}

module.exports = GET_ALL_NMZ