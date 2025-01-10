const { executeQuery } = require("../../../Database/test");

const UPDATE_NOTIFICATIONS = async (req, res) => {
    try {
        const { id, title, content, isView, options } = req.body;

        if(options === "setAll")
        {
            const query = "UPDATE notifications SET isView = 1 WHERE user = ?"

            const data = await executeQuery(query , [req.user.id])

            return res.status(200).json({
                success:false, 
                data: data,
                message: "Амжилттай"
            })

        }


        if (!id) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Шинэчлэх мэдээллийн ID байхгүй байна.",
            });
        }

        let setQuery = [];
        let values = [];

        if (title) {
            setQuery.push("title = ?");
            values.push(title);
        }
        if (content) {
            setQuery.push("content = ?");
            values.push(content);
        }
        if (typeof isView !== "undefined") { 
            setQuery.push("isView = ?");
            values.push(isView);
        }

        if (setQuery.length === 0) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Шинэчлэх өгөгдөл байхгүй байна.",
            });
        }

        const query = `UPDATE notifications SET ${setQuery.join(", ")} WHERE id = ?`;
        values.push(id);

        const result = await executeQuery(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Шинэчлэхэд алдаа гарлаа эсвэл мэдээлэл олдсонгүй.",
            });
        }

        return res.status(200).json({
            success: true,
            data: result,
            message: "Амжилттай шинэчиллээ.",
        });
    } catch (err) {
        console.error("Алдаа гарлаа:", err);
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа: " + err.message,
        });
    }
};

module.exports = UPDATE_NOTIFICATIONS;
