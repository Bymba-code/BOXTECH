const { executeQuery } = require("../../../Database/test");

const UPDATE_PRODUCT = async (req, res) => {
    try {
        const { id, category, productName, short_desc, long_desc, size, img } = req.body;


        // 1. ID байгаа эсхийг шалгана
        if (!id) {
            return res.status(403).json({
                success: false,
                data: [],
                message: "Файлын ID байхгүй байна."
            });
        }

        // 2. Тухайн хэрэглэгчийн файл мөн эсэхийг шалгана
        const queryPRODUCT = "SELECT * FROM products WHERE id = ?"
        const productDB = await executeQuery(queryPRODUCT, [id])
        
        if(productDB.length === 0)
        {
            return res.status(404).json({
                success:false,
                data: [],
                message: "Файл олдсонгүй"
            })
        }

        const product = productDB[0]
        
        if(product.user !== req.user.id)
        {
            return res.status(401).json({
                success:false,
                data: [],
                message: "Таны хандах эрх хүрэхгүй байна."
            })
        }


        const fieldsToUpdate = [];
        const values = [];

        if (category) {
            fieldsToUpdate.push("category = ?");
            values.push(category);
        }
        if (productName) {
            fieldsToUpdate.push("product_name = ?");
            values.push(productName);
        }
        if (short_desc) {
            fieldsToUpdate.push("short_desc = ?");
            values.push(short_desc);
        }
        if (long_desc) {
            fieldsToUpdate.push("long_desc = ?");
            values.push(long_desc);
        }
        if (size) {
            fieldsToUpdate.push("size = ?");
            values.push(size);
        }
        if (img) {
            fieldsToUpdate.push("img_url = ?");
            values.push(img);
        }

        values.push(id);

        const query = `
            UPDATE products 
            SET ${fieldsToUpdate.join(", ")} 
            WHERE id = ?
        `;

        const data = await executeQuery(query, values);

        if (data.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Файлыг шинэчлэхэд алдаа гарлаа"
            });
        }

        return res.status(200).json({
            success: true,
            data: data,
            message: "Амжилттай шинэчиллээ."
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа гарлаа: " + err.message
        });
    }
};

module.exports = UPDATE_PRODUCT;
