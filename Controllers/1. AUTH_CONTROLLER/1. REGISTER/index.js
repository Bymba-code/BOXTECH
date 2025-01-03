const {executeQuery} = require("../../../Database/test")
const bcrypt = require("bcrypt")

const REGISTER = async (req , res) => {
    try 
    {
        const errors = {}
        const {username, email, password, confirmPassword, role} = req.body;



        // 1. Хоосон эсхийг шалгах
        if(!username)
        {
            errors.username = "Хэрэглэгчийн нэр хоосон байна."
        }
        if(!email)
        {
            errors.email = "И-Мейл хаяг хоосон байна."
        }
        if(!password)
        {
            errors.password = "Нууц үг хоосон байна."
        }
        if(!confirmPassword)
        {
            errors.confirmPassword ="Давтан нууц үг хоосон байна."
        }

        if(Object.keys(errors).length > 0)
        {
            return res.status(400).json({
                success:false, 
                data: [],
                errors: errors
            })
        }

        // 2. Адилхан мөрийг шалгах
        const checkUsername = `SELECT * FROM users WHERE username = ?`
        const usernameData = await executeQuery(checkUsername, [username])

        if(usernameData.length > 0)
        {
            return res.status(403).json({
                success:false,
                data:null,
                message: "Хэрэглэгчийн нэр бүртгэгдсэн байна."
            })
        }

        const checkEmail = `SELECT * FROM users WHERE email = ?`
        const emailData = await executeQuery(checkEmail, [email])
        if(emailData.length > 0)
        {
            return res.status(403).json({
                success:false, 
                data:null,
                message: "И-Мейл хаяш бүртгэгдсэн байна."
            })
        }


        // 3. Нууц үг хоорондоо таарах эсхийг шалгах
        if(password !== confirmPassword)
        {
            return res.status(403).json({
                success:false,
                data:null,
                message: "Нууц үг хоорондоо таарахгүй байна."
            })
        }

        // 4. Нууц үгийг нуух
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // 5. Өгөгдлийн боловсруулах
        const values = [
            username, 
            email,
            hashedPassword,
            role,
            new Date()
        ]

        const insertRowQuery = "INSERT INTO users (`username`,`email`,`password`,`role`,`create_date`) VALUES (?,?,?,?,?)"
        const insertData = await executeQuery(insertRowQuery, values)


        // 6. Хэрэглэгчийн бүртгэснийг шалган дараагийн алхамийг эхлүүлэх
        if(insertData.affectedRows > 0)
        {

            // 7. Хэрэглэгчийн сунгалтийн мэдээллийг оруулах
            const createSubQuery = "INSERT INTO user_subscription (`user`,`start_date`,`end_date`) VALUES (?,?,?)"
            const data = await executeQuery(createSubQuery, [insertData.insertId, new Date(), new Date()])
            if(data.affectedRows > 0)
                {
                    return res.status(200).json({
                        success:true,
                        data:null,
                        message: "Хэрэглэгчийн бүртгэлийг амжилттай үүсгэлээ."
                    })
            }  
        }
        else 
        {
            return res.status(405).json({
                success:false,
                data:null,
                message: "Хэрэглэгчийг бүртгэхэд алдаа гарлаа."
            })
        }
        
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

module.exports = REGISTER