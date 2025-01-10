const {executeQuery} = require("../../../Database/test")

const PROFILE_HOME_DETAIL = async (req , res) => {
    try 
    {
       const query = `SELECT DISTINCT
                        u.id AS user_id,
                        u.username,
                        u.email,
                        u.role,
                        u.create_date,
                        us.start_date, 
                        us.end_date,
                        ub.name AS bank_name,
                        ub.account,
                        COUNT(products.id) AS count
                        FROM users u
                        LEFT JOIN user_subscription us ON u.id = us.user 
                        LEFT JOIN user_bank ub ON u.id = ub.user
                        LEFT JOIN products ON u.id = products.user
                        WHERE u.id = ?
                        `

        const data = await executeQuery(query, [req.user.id])

        return res.status(200).json({
            success:true,
            data: data,
            message: "Амжилттай"
        })
    }   
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа гарлаа" + err
        })
    }
}       

module.exports = PROFILE_HOME_DETAIL