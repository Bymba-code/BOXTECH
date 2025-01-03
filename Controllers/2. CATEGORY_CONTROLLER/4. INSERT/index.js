const {executeQuery} = require("../../../Database/test")

const INSERT_CATEGORY = async (req, res) => {
    try 
    {
       const {categoryName} = req.body;

       if(!categoryName)
       {
            return res.status(403).json({
                success:false,
                data: [],
                message: "Төрлийн нэрийг оруулна уу"
            })
       }

       const checkQuery = `SELECT * FROM category WHERE name = ?`
       const check = await executeQuery(checkQuery, [categoryName])
       if(check.length > 0)
       {
            return res.status(403).json({
                success:false,
                data: [],
                message: `${categoryName} төрөл нь аль хэдийн нэмэгдсэн байна.`
            })
       }

       
       const query = "INSERT INTO category (`name`, `date`) VALUES (? , ?)"
       const data = await executeQuery(query, [categoryName, new Date()])

       if(data.affectedRows === 0)
       {
            return res.status(401).json({
                success:false,
                data: [],
                message: "Төрлийг нэмхэд алдаа гарлаа"
            })
       }

       return res.status(200).json({
            success:true,
            data: data,
            message: "Төрлийг амжилттай нэмлээ"
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

module.exports = INSERT_CATEGORY