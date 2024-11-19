const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authenticateToken = (req, res, next) => {
    let token;
    if(req.cookies && req.cookies.BOXTECH_TOKEN)
    {
        token = req.cookies.BOXTECH_TOKEN; 
    }

    if (!token) {
        return res.status(403).json({
            success: false,
            message: "Токен олдсонгүй"  
        });
    }

    jwt.verify(token, process.env.TOKEN_SECURE, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Токен буруу байна"
            });
        }
        req.user = user; 
        next();  
    });
};

module.exports = authenticateToken;