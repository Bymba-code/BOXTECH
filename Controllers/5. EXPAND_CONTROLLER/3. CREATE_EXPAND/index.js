const {executeQuery} = require("../../../Database/test")

const CREATE_EXPAND = async (req , res) => {
    try 
    {
        const user = req.user;
        const id = user.id;

        const {amount , description} = req.body;

        if(!amount)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Үнийн дүн хоосон байна."
            })
        }
        if(!description)
            {
                return res.status(403).json({
                    success:false,
                    data: [],
                    message: "Тайлбар хоосон байна."
                })
            }

        const query = "INSERT INTO expand_checkout (`user`, `amount`, `description`) VALUES (? , ? , ?)"
        const data = await executeQuery(query, [id, amount, description])

        if(data.affectedRows === 0)
        {
            return res.status(404).jso({
                success:false,
                data: [],
                message: "Сунгалт үүсгэхэд алдаа гарлаа"
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

module.exports = CREATE_EXPAND