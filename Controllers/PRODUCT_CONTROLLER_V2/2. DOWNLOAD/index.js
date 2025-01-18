const { executeQuery } = require("../../../Database/test");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv");

const downloadFile = async (req, res) => {
    try {
        const { id, token } = req.params;

        // Step 1: Get product information
        const queryOne = "SELECT * FROM products WHERE id = ?";
        const productDB = await executeQuery(queryOne, [id]);

        if (!productDB || productDB.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        const product = productDB[0];

        // Step 2: Decode token
        const accessToken = jwt.verify(token, process.env.TOKEN_SECRET);

        if (accessToken.role === "user") {
            const queryTwo = "SELECT * FROM user_products WHERE user = ? AND product = ?";
            const userProductData = await executeQuery(queryTwo, [accessToken.id, id]);

            if (userProductData.length === 0) {
                return res.status(403).send(`
                    <!DOCTYPE html>
                    <html lang="mn">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Access Denied</title>
                    </head>
                    <body>
                        <h1>You do not have permission to download this file.</h1>
                        <p>Please purchase it to gain access.</p>
                        <a href="/boxtech/store">Purchase File</a>
                    </body>
                    </html>
                `);
            }

            const expiryDate = new Date(userProductData[0].date);
            if (expiryDate < new Date()) {
                return res.status(403).send(`
                    <!DOCTYPE html>
                    <html lang="mn">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>File Access Expired</title>
                    </head>
                    <body>
                        <h1>Your download access has expired.</h1>
                        <p>Please repurchase the file to regain access.</p>
                        <a href="/boxtech/store">Repurchase File</a>
                    </body>
                    </html>
                `);
            }
        }

        const filePath = path.join(__dirname, "../../../uploads/files", product.file.split("/")[3]);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "The file does not exist or has been removed.",
            });
        }

        // Handle aborted requests
        const onAbort = () => {
            console.log("Client aborted the download request.");
            // Cleanup operations if required
        };

        res.on("close", () => {
            if (!res.writableEnded) {
                console.log("Request closed before file download completed.");
                onAbort();
            }
        });

        return res.download(filePath, product.file.split("/").pop(), (err) => {
            if (err && !res.headersSent) {
                console.error("Error during file download:", err.message);
                return res.status(500).json({
                    success: false,
                    message: "An error occurred during file download.",
                });
            }
        });
    } catch (err) {
        console.error("Error in downloadFile:", err);
        return res.status(500).json({
            success: false,
            message: "Server error occurred.",
        });
    }
};

module.exports = { downloadFile };
