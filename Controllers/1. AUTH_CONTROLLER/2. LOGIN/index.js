const {executeQuery} = require("../../../Database/test")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const LOGIN = async (req, res) => {
    try 
    {
        const {username, password} = req.body;


        // 1. Хоосон эсхийг шалгах
        if(!username)
        {
            return res.status(403).json({
                success:false,
                data:null,
                message: "Хэрэглэгчийн нэр хоосон байна."
            })
        }
        if(!password)
        {
            return res.status(403).json({
                success:false,
                data:null,
                message: "Нууц үг хоосон байна."
            })
        }

        // 2. Хэрэглэгчийн нэр ээр хайх
        const query = `SELECT * FROM users WHERE username = ?`
        const user = await executeQuery(query, [username])
        if(user.length === 0)
        {
            return res.status(404).json({
                success:false,
                data:null,
                message: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна."
            })
        }   

        // 3. Нууц үгийг шалгах
        const data = user[0]
        const hashedPassword = data.password;

        const checkPassword = bcrypt.compareSync(password, hashedPassword)

        if(!checkPassword)
        {
            return res.status(403).json({
                success:false,
                data:null,
                message: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна."
            })
        }

        // 4. Токен боловсруулалт
        const tokenData = {
            id: data.id,
            role: data.role
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: "1d"
        })

        
        return res.status(200).json({
            success: true,
            data: token,
            message: "Амжилттай нэвтэрлээ."
        });





    
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

module.exports = LOGIN