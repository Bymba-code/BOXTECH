const { executeQuery } = require("../../../DATABASE");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config(); 


const AUTH_LOGIN = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Хэрэглэгчийн нэр хоосон байна"
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Нууц үгээ оруулна уу"
            });
        }

        const checkQuery = 'SELECT * FROM users WHERE username = ?';
        const  checkData  = await executeQuery(checkQuery, [username]);

        if (checkData === 0) {
            return res.status(404).json({
                success: false,
                message: "Хэрэглэгч олдсонгүй"
            });
        }

        const user = checkData[0];
        const hashedPassword = user.password;

        const passwordMatch = await bcrypt.compareSync(password, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Нууц үг буруу байна"
            });
        }


        const token = jwt.sign(
            {id:user.id , username: user.username},
            process.env.TOKEN_SECURE,
            {expiresIn: '2h'}
        )

        res.cookie('BOXTECH_TOKEN', token , {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000
        })


        return res.status(200).json({
            success: true,
            data: { id: user.id, username: user.username }, 
            message: "Амжилттай нэвтэрлээ."
        });


    } catch (err) {
        console.error("Error in AUTH_LOGIN:", err);
        return res.status(500).json({
            success: false,
            message: "Серверийн алдаа. Дэлгэрэнгүй мэдээллийг логуудаас шалгана уу."
        });
    }
};

module.exports = AUTH_LOGIN;
