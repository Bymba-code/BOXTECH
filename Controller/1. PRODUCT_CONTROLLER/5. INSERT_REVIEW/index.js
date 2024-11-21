const { executeQuery } = require("../../../DATABASE");

const INSERT_REVIEW_PRODUCT = async (req, res) => {
    try {

        const {product, user} = req.body;

        if(!product)
        {
            return res.status(403).json({
                success:false,
                data:null,
                message: "Файлын ID байхгүй"
            })
        }
        if(!user)
        {
            return res.status(403).json({
                success:false,
                data:null,
                message: "Хэрэглэгч байхгүй"
            })
        }
            
        
        const distinctQuery = "SELECT * FROM product_reviews WHERE product = ? AND user = ?"

        const check = await executeQuery (distinctQuery, [product.toString(), user.toString()])

        if(check.length > 0)
        {
            return res.status(400).json({
                success: false,
                data:null,
                message: "Хэрэглэгч алв хэдийн барааг үзсэн байна."
            })
        }
        
        const values = [
            product, user, new Date()
        ]
        
        const query = "INSERT INTO product_reviews (`product`,`user`,`date`) VALUES (?  , ? , ?)" 
        const data = await executeQuery(query, values)

        if(data.affectedRows > 0) 
        {
            return res.status(200).json({
                success:true,
                data:null,
                message: "Амжилттай"
            })
        }

        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Серверийн алдаа. Дэлгэрэнгүй мэдээллийг логуудаас шалгана уу."
        });
    }
};

module.exports = INSERT_REVIEW_PRODUCT
