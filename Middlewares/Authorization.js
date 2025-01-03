const Authorize = (requiredRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Үйлдэл хийхийн тулд нэвтэрнэ үү." });
            }

            if (!requiredRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Таны хандах эрх хүрэхгүй байна." });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success:false,
                data:null,
                message: "Серверийн алдаа гарлаа : " + err 
            })
        }
    };
};

module.exports = Authorize