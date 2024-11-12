const {executeQuery} = require("../../../DATABASE/index")

const POST_CREATE_CATEGORY = async(req, res) => {
    try 
    {
        const {name} = req.body;

        const checkQuery = "SELECT * FROM categories WHERE name = ?"

        const checkData = await executeQuery(checkQuery, [name])

        if(checkData.length > 0)
        {
            return res.status(403).json({
                success:false,
                data: null,
                message: "Төрөл аль хэдийн нэмэгдсэн байна."
            })
        }

        const query = "INSERT INTO categories (`name`) VALUES (?)"

        const data = await executeQuery(query, [name])

        if(data)
        {
            return res.status(200).json({
                success:true,
                data: data,
                message: "Төрлийг амжилттай нэмлээ."
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

module.exports = POST_CREATE_CATEGORY