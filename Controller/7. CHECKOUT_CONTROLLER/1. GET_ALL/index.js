const {executeQuery} = require("../../../DATABASE/index")


const GET_ALL_CHECKOUT = async (req, res) => {
    try 
    {
        const query = `SELECT * FROM checkouts`

        const data = await executeQuery(query)

        return res.status(200).json({data})
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: null,
            message: "Серверийн алдаа" + err
        })
    }
}

module.exports = GET_ALL_CHECKOUT