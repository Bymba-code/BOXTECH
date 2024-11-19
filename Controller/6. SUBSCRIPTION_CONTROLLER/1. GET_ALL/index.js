const {executeQuery} = require("../../../DATABASE/index")

const GET_ALL_SUB = async (req, res) => {
    try 
    {
        const query = `select 
                       users.id, 
                       users.username,
                        users.profile_img,
                        users.role,
                        user_subscription.start_date,
                        user_subscription.end_date
                        from users
                        LEFT JOIN  user_subscription ON users.id = user_subscription.user`

        const data = await executeQuery(query)
        
        if(data)
        {
            return res.status(200).json({
                success:true, 
                data:data,
                message: "Амжилттай"
            })
        }

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

module.exports = GET_ALL_SUB