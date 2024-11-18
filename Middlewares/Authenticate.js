const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); 

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Токен байхгүй эсвэл хугацаа дууссан байна.'
        });
    }

    jwt.verify(token, process.env.TOKEN_SECURE, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Буруу токен'
            });
        }

        req.user = decoded; 
        next(); 
    });
};

module.exports = authenticateToken;
