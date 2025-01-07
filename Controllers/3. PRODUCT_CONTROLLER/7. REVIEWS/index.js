const {executeQuery} = require("../../../Database/test")

const INSERT_REVIEWS = async (req, res) => {
    try 
    {
        const {id} = req.params;

        if(!id)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Файлын ID байхгүй байна."
            })
        }

        const query = "INSERT INTO product_reviews (`product`) VALUES (?)"

        const data = await executeQuery(query, [id])

        if(data.affectedRows === 0)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Ямар нэгэн алдаа гарлаа"
            })
        }
        
        return res.status(200).json({
            success:true,
            data: [],
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

module.exports = INSERT_REVIEWS