const jwt = require("jsonwebtoken");

const Authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']; 

        // Header байхгүй
        if (!authHeader) {
            return res.status(401).json({ message: "БУРУУ ХҮСЭЛТ!" });
        }

        // Токений алдаа
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "ТОКЕН ОЛДСОНГҮЙ" });
        }

        // Токен баталгаажуулах
        const accessToken = jwt.verify(token, process.env.TOKEN_SECRET);

        req.user = accessToken;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "ТОКЕНИЙ ХУГАЦАА ДУУССАН" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "БУРУУ ТОКЕН"});
        }
        return res.status(500).json({ message: "СЕРВЕРИЙН АЛДАА ГАРЛАА" });
    }
};

module.exports = Authenticate;
