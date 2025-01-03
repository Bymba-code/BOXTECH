const { default: axios } = require("axios");
const {executeQuery} = require("../../../Database/test")

const INSERT_BANK = async (req, res) => {
    try 
    {
        const {account, bank, name} = req.body;

        const khanbankToken = `SELECT * FROM khanbank_token WHERE id = 1`
        const khanbank = await executeQuery(khanbankToken)
        
        if(khanbank.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Gateway токен олдсонгүй."
            })
        }
        
        const gateToken = khanbank[0].access_token

        // 1. Хоосон талбарыг шалгана
        if(!account)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Дансны дугаараа оруулна уу."
            })
        }
        if(!bank)
        {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Банк сонгоно уу."
            })
        }
        if(!name)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Данс эзэмшигчийн нэрийг оруулна уу."
            })
        }

        const response = await axios.get(`https://api.khanbank.com/v1/accounts/${account}/name?bank=050000`, {headers:{
            Authorization: `Bearer ${gateToken}`

        }})

        if(response.data.customer.custFirstName.toUpperCase() !== name.toUpperCase())
        {
            return res.status(400).json({
                success:false,
                data: [],
                message: "Данс эзэмшигчийн нэр буруу байна."
            })
        }
            

        // 3. Өгөгдлийн сан уруу инсертлэнэ
        const query = "UPDATE user_bank SET name = ?, account = ?, bank = ? WHERE user = ?";
        const data = await executeQuery(query, [name, account,  bank, req.user.id])

        if(data.affectedRows === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Данс нэмэхэд алдаа гарлаа."
            })
        }

        return res.status(200).json({
            success:false,
            data:[],
            message: "Дансны дугаарыг амжилттай шинэчиллээ."
        })

    
    }
    catch(err)
    {
        const error = err.status === 400 ? "Дансны дугаар буруу байна.": ""
        
        return res.status(500).json({
            success:false,
            data:null,
            message: "Серверийн алдаа гарлаа : " + error
        })
    }
}

module.exports = INSERT_BANK