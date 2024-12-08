const { executeQuery } = require("../../../DATABASE/index");

const DELETE_USER = async (req, res) => {
    try {
       const {id} = req.body;

       const query = "DELETE FROM users WHERE id = ?"
     
       const data= await executeQuery(query, [id])

       if(data)
       {
        return res.status(200).json({
            success: true,
            data: data,
            message: "Амжилттай"
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

module.exports = DELETE_USER