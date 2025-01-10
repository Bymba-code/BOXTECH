const {executeQuery} = require("../../../Database/test")

const INSERT_REVIEWS_NEWS = async (req , res) => {
    try 
    {
        const {id} = req.params;

        const query = "INSERT INTO news_reviews (`news`) VALUES (?)"
        
        const data = await executeQuery(query, [id])
        
        return res.status(200).json({
            success:true,
            data:[],
            message: "Амжилттай"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа" + err
        })
    }
}

module.exports = INSERT_REVIEWS_NEWS