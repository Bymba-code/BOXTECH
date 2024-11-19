const {executeQuery} = require("../../../DATABASE/index")

const UPDATE_SUB = async (req, res) => {
    try 
    {
        const {checkout} = req.body;

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
            data: null,
            message: "Серверийн алдаа" + err
        })
    }
}

module.exports = UPDATE_SUB 