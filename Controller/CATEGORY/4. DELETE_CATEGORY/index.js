const {executeQuery} = require("../../../DATABASE/index")

const DELETE_CATEGORY = async(req, res) => {
    try 
    {
        const {name} = req.body;

        const checkQuery = "SELECT * FROM categories WHERE name = ?"

        const checkData = await executeQuery(checkQuery, [name])

        if(checkData.length === 0)
        {
            return res.status(403).json({
                success:false,
                data: null,
                message: "Төрөл олдсонгүй."
            })
        }

        const deleteQuery = "DELETE FROM categories WHERE name = ?";
        const deleteData = await executeQuery(deleteQuery, [name]);

        if (deleteData.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Төрлийг амжилттай устгалаа."
            });
        } else {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Устгах үед алдаа гарлаа."
            });
        }

    }
    catch(err)
    {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа",
            error: err.message || err
        });
    }
}

module.exports = DELETE_CATEGORY