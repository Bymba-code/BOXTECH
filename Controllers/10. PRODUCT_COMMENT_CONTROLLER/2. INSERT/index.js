const {executeQuery} = require("../../../Database/test")

const CREATE_COMMENT = async (req, res) => {
    try 
    {   
        const {title, content, productId} = req.body;
        
        if(!title)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Гарчиг оруулна уу"
            })
        }
        if(!content)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Сэтгэгдэл оруулна уу."
            })
        }

        const query = "INSERT INTO product_comments (`user`,`product`,`title`,`content`,`date`) VALUES (?, ?, ? ,? ,?)"

        const data = await executeQuery(query, [req.user.id, productId, title, content, new Date()])
        
        if(data.affectedRows === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Ямар нэгэн алдаа гарлаа."
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
            data: [],
            message: "Серверийн алдаа гарлаа " + err
        })
    }
} 

module.exports = CREATE_COMMENT