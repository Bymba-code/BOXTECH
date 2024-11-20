const { executeQuery } = require("../../../DATABASE");

const GET_USER_PRODUCT = async (req, res) => {
    try {
        const {id} = req.params;

        const query = "SELECT * FROM user_product WHERE user = ?" 

        const data = await executeQuery(query, [id])
        return res.status(200).json({
            success:true,
            data:data,
            message: "Амжилттай"
        })
      
    } catch (err) {
        return res.status(500).json({
            success: false,
            data:null,
            message: "Серверийн алдаа. Дэлгэрэнгүй мэдээллийг логуудаас шалгана уу."
        });
    }
};

module.exports = GET_USER_PRODUCT;
