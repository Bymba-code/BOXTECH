const { executeQuery } = require("../../../Database/test");
const path = require('path');
const fs = require('fs');

const downloadFile = async (req, res) => {
    try {
        const { id } = req.params; 

        // Query to get product details based on product ID
        const queryOne = `SELECT * FROM products WHERE id = ?`;
        const productDB = await executeQuery(queryOne, [id]);
        const product = productDB[0];

        // Check if the user has access to download the file
        const queryTwo = `SELECT * FROM user_products WHERE user = ? AND product = ? LIMIT 1`;
        const userPermission = await executeQuery(queryTwo, [req.user.id, product.id]);
        const permissionDate = userPermission[0];

        if (!permissionDate) {
            return res.status(402).json({
                success: false,
                data: [],
                message: "Та файлыг худалдаж авна уу." // You need to buy the file
            });
        }

        const today = new Date();
        if (new Date(permissionDate.date) <= today) {
            return res.status(403).json({
                success: false,
                data: [],
                message: "Таны файлыг татаж авах хугацаа дууссан байна." // Your file download period has expired
            });
        }

        // Fetch the file path from the product data
        const filePath = path.join(__dirname, '../../../uploads/files', product.file.split("/")[3]);
        const fileName = product.file.split("/").pop(); // Get the file name from the path

        // If the file exists on the server, start the download
        if (fs.existsSync(filePath)) {
            const fileStats = fs.statSync(filePath);
            const fileSize = fileStats.size;
            const range = req.headers.range;

            if (range) {
                const [start, end] = range
                    .replace(/bytes=/, "")
                    .split("-")
                    .map(Number);

                const chunkSize = end - start + 1;

                const readStream = fs.createReadStream(filePath, { start, end });
                
                res.status(206);  // Partial content status for range requests
                res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
                res.setHeader("Accept-Ranges", "bytes");
                res.setHeader("Content-Length", chunkSize);
                res.setHeader("Content-Type", "application/octet-stream");

                // Pipe the stream to the response
                readStream.pipe(res);
            } else {
                // Send the file fully if no range is specified
                res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
                res.setHeader("Content-Type", "application/octet-stream");

                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);  // Stream the whole file
            }
        } else {
            return res.status(404).json({
                success: false,
                message: 'File has expired or does not exist.'  // If the file was not found
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: [],
            message: "A server error occurred."  // Internal server error message
        });
    }
};

module.exports = { downloadFile };
