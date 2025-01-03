const {executeQuery} = require("../../../Database/test")

const INSERT_FAVOURITE = async (req, res) => {
    try 
    {
        const {product} = req.body;
        
        // 1. Файл байгаа эсэхийг шалгах
        const checkProductQuery = "SELECT * FROM products WHERE id = ?"
        const isAvailableProduct = await executeQuery(checkProductQuery, [product])

        if(isAvailableProduct.length === 0)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Файл устарсан эсвэл байхгүй байна."
            })
        }


        // 2. Нэмсэн эсэхийг шалгах
        const checkQuery = "SELECT * FROM user_favourite WHERE product = ? AND user = ?"
        const isCheck = await executeQuery(checkQuery, [product, req.user.id])

        if(isCheck.length !== 0)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Файл танд таалагдсан хуудсанд нэмэгдсэн байна."
            })
        }


        // 3. Нэмэх
        const query = "INSERT INTO user_favourite (`user`,`product`) VALUES (? , ?)"
        const data = await executeQuery(query, [req.user.id , product])

        if(data.affectedRows === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Нэмэхэд ямар нэгэн алдаа гарлаа"
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
            data:null,
            message: "Серверийн алдаа гарлаа : " + err 
        })
    }
}

module.exports = INSERT_FAVOURITE