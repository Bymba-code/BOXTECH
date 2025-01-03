const {executeQuery} = require("../../../Database/test")

const DELETE_FAVOURITE = async (req, res) => {
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


        // 2. Хэрэглэгч файлыг нэмсэн эсэхийг шалгах
        const checkUserFavourite = "SELECT * FROM user_favourite WHERE product = ? AND user = ?"
        const isAvailableFavourite = await executeQuery(checkUserFavourite , [product, req.user.id])

        if(isAvailableFavourite.length === 0)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Тухайн файл танд таалагдсан файл дотор байхгүй байна."
            })
        }

        const query = "DELETE FROM user_favourite WHERE product = ? AND user = ?"
        const data = await executeQuery(query, [product, req.user.id])

        if(data.affectedRows === 0)
        {
            return req.status(404).json({
                success:false,
                data: [],
                message: "Устгахад ямар нэгэн алдаа гарлаа"
            })
        }

        return res.status(200).json({
            success:true,
            data: [],
            message: "Амжилттай устгалаа."
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

module.exports = DELETE_FAVOURITE