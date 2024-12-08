const { executeQuery } = require("../../../DATABASE/index");
const bcrypt = require("bcrypt");  


const UPDATE_USER = async (req, res) => {
    try {
       const {id, password} = req.body;

       const query = "UPDATE users SET password = ? WHERE id = ?"
     
       const salt = await bcrypt.genSaltSync(10)
       const hashedPassword = await bcrypt.hash(password, salt);


       const data = await executeQuery(query, [hashedPassword, id])

        if (data) {
            return res.status(200).json({
                success: true,
                message: "Password updated successfully"
            });
        } 


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: `Серверийн алдаа гарлаа: ${err.message}`
        });
    }
}

module.exports = UPDATE_USER
