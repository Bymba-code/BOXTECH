const {executeQuery} = require("../../../Database/test")

const NEWS_CATEGORY = async (req , res) => {
    try 
    {
        const query = "SELECT * FROM news_category"

        const data = await executeQuery(query)

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
            data: [],
            message: "Серверийн алдаа гарлаа"
        })
    }
}

module.exports = NEWS_CATEGORY