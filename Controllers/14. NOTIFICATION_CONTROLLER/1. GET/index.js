const {executeQuery} = require("../../../Database/test")

const GET_NOTIFICATIONS = async (req , res) => {
    try 
    {

        const countQuey = `SELECT 
                          COUNT(*) AS unread
                          FROM notifications
                          WHERE isView = 0`

        const unread = await executeQuery(countQuey)

        const badge = unread[0]


        const query = `SELECT 
        * FROM 
        notifications 
        WHERE user = ?
        ORDER BY notifications.date DESC`

        const data = await executeQuery(query, [req.user.id])

        return res.status(200).json({
            success:true,
            data: data,
            badge: badge.unread,
            message: "Амжилттай"
        })
    }   
    catch(err)
    {
        console.error("Алдаа гарлаа" , err)
        return res.status(500).json({
            success:false,
            data: [],
            message: "Серверийн алдаа гарлаа." + err
        })
    }
}

module.exports = GET_NOTIFICATIONS