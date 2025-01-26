const {executeQuery} = require("../../../Database/test")


const INSERT_NMZ = async (req , res) => {
    try 
    {
        const {phone, desc} = req.body

        const query = "INSERT INTO NMZ (`phone`,`desc`, `date`) VALUES (? , ? , ?)"

        const data = await executeQuery(query,[phone,desc, new Date()])
        
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
            data:[],
            message: "Серверийн алдаа"
        })
    }
}

module.exports = INSERT_NMZ