const { executeQuery } = require("../../../DATABASE/index");
const bcrypt = require("bcrypt");

const LOGIN = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Хэрэглэгчийн нэвтрэх нэр ээ оруулна уу."
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Нууц үгээ оруулна уу."
            });
        }

        const checkQuery = "SELECT * FROM users WHERE username = ?";
        
        const user = await executeQuery(checkQuery, [username]);

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Хэрэглэгч олдсонгүй."
            });
        }

        const passwordMatch = bcrypt.compareSync(password, user[0].password);

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Нууц үг буруу байна."
            });
        }

        const subscriptionQuery = "SELECT * FROM userSubscription WHERE username = ?"

        const subscription = await executeQuery(subscriptionQuery , [username])

        return res.status(200).json({
            success: true,
            data: {
                username: user[0].username
            },
            subscription: subscription
            ,
            message: "Амжилттай нэвтэрлээ."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
            error: err.message || err
        });
    }
};

module.exports = LOGIN;
