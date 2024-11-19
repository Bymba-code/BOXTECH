const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log(req.user)

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Хандах эрх хягаарлагдсан" 
            });
        }
        next(); 
    };
};

module.exports = authorizeRoles;