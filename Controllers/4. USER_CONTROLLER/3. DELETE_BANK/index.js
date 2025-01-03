const {executeQuery} = require("../../../Database/test")

const DELETE_BANK = async (req, res) => {
    try 
    {
       
        // 1. Хэрэглэгч данс нэмсэн эсэхийг шалгана
        const checkQuery = "SELECT * FROM user_bank WHERE user = ?"
        const check = await executeQuery(checkQuery, [req.user.id])

        if(check.length === 0)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Устгах дансны дугаар олдсонгүй."
            })
        }


        // 3. Өгөгдлийн сан уруу инсертлэнэ
        const query = "DELETE FROM user_bank WHERE user = ?"
        const data = await executeQuery(query, [req.user.id])

        if(data.affectedRows === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Данс устгахад алдаа гарлаа."
            })
        }

        return res.status(200).json({
            success:false,
            data:[],
            message: "Дансны дугаарыг амжилттай устгалаа."
        })

    
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа : " + err 
        })
    }
}

module.exports = DELETE_BANK 