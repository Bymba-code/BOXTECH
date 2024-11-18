const {executeQuery} = require("../../../DATABASE")
const bcrypt = require("bcrypt")


const AUTH_REGISTER = async (req, res) => {
    try 
    {
        const {username, email, password, confirmPassword} = req.body;
        
        if(!username) 
        {
            return res.status(403).json({
                success: false,
                data: null,
                message: "Хэрэглэгчийн нэвтрэх нэрийг оруулна уу"
            })
        }
        if(!email) 
            {
                return res.status(403).json({
                    success: false,
                    data: null,
                    message: "И-мейл хаягаа оруулна уу"
                })
            }
        if (!password) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Нууц үг хоосон байна."
                });
        }
        const passwordStrengthRegex = /^(?=.*[A-Z]).{8,}$/;
        if (!passwordStrengthRegex.test(password)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Нууц үг 8 тэмдэгтээс доошгүй, хамгийн багадаа нэг том үсэг агуулсан байх ёстой."
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Нууц үг хоорондоо таарахгүй байна."
            });
        }

        const checkQuery = `SELECT * FROM users WHERE username = ?`
        const checkData = await executeQuery(checkQuery, [username])

        if(checkData.length > 0)
        {
            return res.status(400).json({
                success: true, 
                data: null,
                message: "Хэрэглэгчийн нэр бүртгэгдсэн байна."
            })
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const values = [
            username, 
            email,
            hashedPassword,
            null,
            "user",
            new Date()
        ]
        
        const query = "INSERT INTO users (`username`, `email`, `password`, `profile_img`, `role`, `create_date`) VALUES (?, ?, ?, ?, ? , ?)";

        const data = await executeQuery(query, values)

        if(data)
            {
                return res.status(200).json( {
                    success: true,
                    data: data,
                    message: "Бүртгэл амжилттай үүслээ."
                })
            }

        
        
    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа" + err
        })
    }
}

module.exports = AUTH_REGISTER