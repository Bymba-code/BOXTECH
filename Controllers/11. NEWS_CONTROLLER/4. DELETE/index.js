const {executeQuery} = require("../../../Database/test")

const GET_NEWS = async (req, res) => {
    try 
    {
        
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа гарлаа" + err
        })
    }
}

module.exports = GET_NEWS