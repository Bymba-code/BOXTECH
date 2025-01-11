const {executeQuery} = require("../../../Database/test")

const GET_ALL_CATEGORY = async (req, res) => {
    try 
    {
        const query =   `SELECT 
                        c.*,
                        COUNT(p.id) AS total_products,
                        COUNT(dh.id) AS total_sold
                        FROM 
                        category c
                        LEFT JOIN 
                        products p ON c.id = p.category
                        LEFT JOIN 
                        deposit_history dh ON p.id = dh.product
                        GROUP BY 
                        c.id
                    `

        const data = await executeQuery(query)

        if(data.length === 0)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message:"Өгөгдөл олдсонгүй"
            })
        }

        return res.status(200).json({
            success:true,
            data:data,
            message: "Амжилттай"
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

module.exports = GET_ALL_CATEGORY
