const {executeQuery} = require("../../../DATABASE/index")

const GET_SINGLE_SUB = async (req, res) => {
    try 
    {
        const {id} = req.params;

        const query = `
        select 
	    users.id, 
	    users.username,
	    users.profile_img,
	    users.role,
	    user_subscription.start_date,
	    user_subscription.end_date
	    from users
	    LEFT JOIN  user_subscription ON users.id = user_subscription.user
        WHERE users.id = ?`

        const data = await executeQuery(query, [id])
    
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

module.exports = GET_SINGLE_SUB