const {executeQuery} = require("../../../Database/test")

const INSERT_NOTIFICATIONS = async (req , res) => {
    try 
    {
        const {user , title, content} = req.body;

        if(!user)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Мэдэгдэл илгээх хэрэглигчийг сонгоно уу"
            })
        }
        if(!title)
        {
            return res.status(403).json({
                success:false,
                data:[],
                message: "Мэдэгдлийн гарчиг хоосон байна."
            })
        }
        if(!content)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Илгээх мэдэгдэл хоосон байна."
            })
        }

        const insertQuery = "INSERT INTO notifications (`user`,`title`,`content`, `isView` , `date`) VALUES (?, ?, ?, ?, ?)"

        const data = await executeQuery(insertQuery, [user, title, content, 0, new Date()])

        if(data.affectedRows === 0)
        {
            return res.status(500).json({
                success:false,
                data: [],
                message: "Мэдэгдэл илгээхэд алдаа гарлаа"
            })
        }

        return res.status(200).json({
            success:true,
            data:data,
            message:"Мэдэгдлийг амжилттай илгээлээ."
        })

    }   
    catch(err)
    {
        console.error("Алдаа гарлаа" , err)
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа гарлаа." + err
        })
    }
}

module.exports = INSERT_NOTIFICATIONS