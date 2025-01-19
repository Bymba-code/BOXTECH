const { executeQuery } = require("../../../Database/test");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken")

const downloadFile = async (req, res) => {
    try {
        const { fileID, productID, token } = req.params;

        const accessToken = jwt.verify(token , process.env.TOKEN_SECRET )


        const queryOne = `SELECT * FROM user_products WHERE user = ? AND product = ?`
    
        const userPermissionDB = await executeQuery(queryOne, [accessToken.id, productID])
        const userPermission = userPermissionDB[0]
        

        if (!userPermission) {
            return res.status(401).send(`
                <!DOCTYPE html>
                <html lang="mn">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Access Denied</title>
                </head>
                <body>
                    <h1>Та файлыг худалдаж авна уу!</h1>
                    <p>Энэхүү файлд та хандах эрхгүй байна. Түрүүлж худалдаж аваарай.</p>
                    <a href="/boxtech/store">Худалдаж авах</a>
                </body>
                </html>
            `);
        }


        const today = new Date();
        if (new Date(userPermission.date) < today) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html lang="mn">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Access Expired</title>
                </head>
                <body>
                    <h1>Таны файлыг татаж авах хугацаа дууссан байна.</h1>
                    <p>Та дахин худалдаж авна уу, тэгээд дахин татаж авах боломжтой болно.</p>
                    <a href="/boxtech/store">Дахин худалдаж авах</a>
                </body>
                </html>
            `);
        }

        const query = "SELECT file FROM product_files WHERE id = ?";
        const productFile = await executeQuery(query, [fileID]);

        if (!productFile || productFile.length === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found in the database.",
            });
        }

        const fileName = productFile[0].file;  

        const filePath = path.join(__dirname, "../../../", fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "The file does not exist or has been removed.",
            });
        }

        res.on("aborted", () => {
            console.log("Client aborted the download request.");

        });

        res.on("close", () => {
            if (!res.writableEnded) {
                console.log("Request closed before file download completed.");
            }
        });

        return res.download(filePath, path.basename(filePath), (err) => {
            if (err && !res.headersSent) {
                console.error("Error during file download:", err.message);
                return res.status(500).json({
                    success: false,
                    message: "An error occurred during the download.",
                });
            }

        });

    } catch (err) {
        console.error("Error in downloadFile:", err);
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Server error occurred.",
            });
        }
    }
};

module.exports = { downloadFile };
