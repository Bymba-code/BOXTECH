const { executeQuery } = require('../../../Database/test');

const INSERT_FILES_V2 = async (req, res) => {
    try {
        const { category, productName, price, shortDesc, longDesc, size, fileType } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Файл сонгогдоогүй байна",
            });
        }

        const fileName = req.file.filename; 
        const filePath = `/uploads/images/${fileName}`; 

        const query = `
            INSERT INTO products (
                user, category, file_type, product_name, price, short_desc, long_desc, size, img_url, date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            req.user.id,
            category,
            fileType,
            productName,
            price,
            shortDesc,
            longDesc,
            size,
            filePath,
            new Date()
        ];

        const result = await executeQuery(query, values);

        const queryTwo = "INSERT INTO user_products (`user`,`product`, `date`) VALUES (?, ?, ?)"

        const date = new Date()

        date.setFullYear(date.getFullYear() + 3)

        const data = await executeQuery(queryTwo, [req.user.id, result.insertId, date])

        

        return res.status(201).json({
            success: true,
            data: result,
            message: "Файл амжилттай бүртгэгдлээ",
        });
    } catch (err) {
        console.error("INSERT_FILES_V2 Error:", err);
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа",
        });
    }
};

module.exports = { INSERT_FILES_V2 };
