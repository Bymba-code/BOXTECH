const {executeQuery} = require("../../../Database/test")
require("dotenv")
const jwt = require("jsonwebtoken")

const TOKEN_REFRESH = async (req, res) => {
    try 
    {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({
                success: false,
                message: "Access token байхгүй байна.",
            });
        }
        const token = authHeader.split(" ")[1]; 

        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Access token хүчингүй байна.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Access token хүчинтэй байна.",
            });
        });
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports = TOKEN_REFRESH