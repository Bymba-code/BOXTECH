const {executeQuery} = require("../../../Database/test")

const DELETE_PRODUCT = async (req, res) => {
    try 
    {
        const {id} = req.body;

        // 1. ID байгаа эсхийг шалгана
        if (!id) {
            return res.status(403).json({
                success: false,
                data: [],
                message: "Файлын ID байхгүй байна."
            });
        }
        
        // 2. Тухайн хэрэглэгчийн файл мөн эсэхийг шалгана
        const queryPRODUCT = "SELECT * FROM products WHERE id = ?"
        const productDB = await executeQuery(queryPRODUCT, [id])
        
        if(productDB.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Файл олдсонгүй"
            })
        }

        const product = productDB[0]
        
        if(product.user !== req.user.id)
        {
            return res.status(401).json({
                success:false,
                data: [],
                message: "Таны хандах эрх хүрэхгүй байна."
            })
        }

        const deleteQuery = "DELETE FROM products WHERE id = ?"
        const data = await executeQuery(deleteQuery, [id])
        
        if(data.affecRows === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Файлыг устгахад алдаа гарлаа"
            })
        }

        return res.status(200).json({
            success:true,
            data: data,
            message: "Файлыг амжилттай устгалаа"
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

module.exports = DELETE_PRODUCT 