const {executeQuery} = require("../../../Database/test")

const DELETE_COMMENT = async (req, res) => {
    try 
    {
        const {id, productId} = req.body;

        const query = "DELETE FROM product_comments WHERE id = ? and user = ? and product = ?"

        const data = await executeQuery(query, [id, req.user.id ,productId])

        if(data.affectedRows === 0)
        {
            return res.status(404).json({
                success:false, 
                data: [],
                message: "Устгахад ямар нэгэн алдаа гарлаа."
            })
        }
        return res.status(200).json({
            success:false,
            data: [],
            message: "Амжилттай"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа гарлаа " + err
        })
    }
} 

module.exports = DELETE_COMMENT