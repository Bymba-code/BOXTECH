const {executeQuery} = require("../../../DATABASE/index")

const POST_CREATE_PRODUCT = async(req, res) => {
    try 
    {
        const {username, product_name, short_desc, description, price, link} = req.body;

        const values = [
            username, product_name, short_desc, description, price, link
        ]
        
        if(!username)
        {
            return res.status(403).json({
                success:false, 
                data: null,
                message: "Нэвтэрнэ үү."
            })
        }
        if(!product_name)
        {
            return res.status(403).json({
                success:false, 
                data: null,
                message: "Өөрийн файлын нэрийг оруулна уу."
            })
        }
        if(!short_desc)
        {
            return res.status(403).json({
                success:false, 
                data: null,
                message: "Богино тайлбарыг оруулна уу."
            })
        }
        if(!description)
        {
            return res.status(403).json({
                success:false, 
                data: null,
                message: "Файлын тайлбарыг оруулна уу."
            })
        }
        if(!price)
        {
            return res.status(403).json({
                success:false, 
                data: null,
                message: "Файлын зарагдах үнэ -ийг оруулна уу."
            })
        }
        if(!link)
        {
            return res.status(403).json({
                success:false, 
                data: null,
                message: "Файлын татах линкийг оруулна уу."
            })
        }

        const query = "INSERT INTO products (`username`, `product_name`, `short_desc`, `description`, `price`, `link`) VALUES (?, ?, ? ,? ,? ,?)"

        const data = await executeQuery(query, values)

        if(data)
        {
            return res.status(200).json({
                success:true,
                data: data,
                message: "Таны файлыг амжилттай нэмлээ."
            })
        }

    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
            error: err.message || err
        });
    }
}

module.exports = POST_CREATE_PRODUCT