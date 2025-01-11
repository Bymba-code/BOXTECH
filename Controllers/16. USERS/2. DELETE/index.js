const { executeQuery } = require("../../../Database/test");

const DELETE_USERS = async (req, res) => {
      try 
      {
            const {id} = req.body;

            const query = "DELETE FROM users WHERE id = ?"

            const data = await executeQuery(query, [id])

            return res.status(200).json({
                   success:true,
                   data: data,
                   message: "Амжилттай"
            })
      } 
      catch (err) {
            return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа гарлаа : " + err,
            });
        }
};

module.exports = DELETE_USERS;
