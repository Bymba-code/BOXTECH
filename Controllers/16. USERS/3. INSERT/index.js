const { executeQuery } = require("../../../Database/test");
const bcrypt = require("bcrypt")

const INSERT_USERS = async (req, res) => {
  try 
  {
    const {username, email, password, role} = req.body;

    if(!username)
    {
        return res.status(403).json({
            success:false,
            data:[],
            message: "Хэрэглэгчийн нэр оруулна уу."
        })
    }
    if(!email)
    {
        return res.status(403).json({
            success:false,
            data:[],
            message: "Хэрэглэгчийн И-Мейл оруулна уу."
        })
    }
    if(!password)
    {
        return res.status(403).json({
            success:false,
            data:[],
            message: "Хэрэглэгчийн нууц үг хоосон байна."
        })
    }
    if(!role)
    {
        return res.status(403).json({
            success:false,
            data:[],
            message: "Хэрэглэгчийн эрхийг сонгоно уу."
        })
    }

    
    const checkQuery = "SELECT * FROM users WHERE username = ?"

    const correctUsername = await executeQuery(checkQuery, [username])
    if(correctUsername.length === 1)
    {
        return res.status(403).json({
            success:false,
            data:[],
            message: "Хэрэглэгчийн нэр бүртгэлтэй байна."
        })
    }

    
    const query = "INSERT INTO users (`username`,`email`,`password`,`role`,`create_date`) VALUES (?,?,?,?,?)"

    const salt = bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(password, salt)


    const values = [
        username,
        email,
        hashed,
        role,
        new Date()
    ]

    const data = await executeQuery(query, values)

    return res.status(200).json({
        success:true,
        data: data,
        message: "Амжилттай"
    })
  } 
  catch(err) 
  {
    return res.status(500).json({
      success: false,
      data: [],
      message: "Серверийн алдаа " + err
    });
  }
};

module.exports = INSERT_USERS
