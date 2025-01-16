const axios = require("axios");
const { executeQuery } = require("../../../Database/test");
require('dotenv').config();

const GATEWAY_TOKEN = async (req, res) => {
    // 1. Өгөгдлүүд
    const username = process.env.GATEWAY_USERNAME;
    const password = process.env.PASSWORD;
    const url = process.env.GATEWAY_URL_TOKEN;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    try {
        // 2. Өмнөх токеныг авах
        const tokenQuery = `SELECT * FROM khanbank_token WHERE id = 1`;
        const tokenDB = await executeQuery(tokenQuery);

        if (tokenDB.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Хаан банк токен байхгүй байна."
            });
        }

        const token = tokenDB[0].access_token;
        const expiresAt = tokenDB[0].expires_at;

        // 3. Өмнөх токен дууссан эсэхийг шалгах

        const currentTime = new Date(); 
        if (currentTime >= new Date(expiresAt)) {
            // 4. Токен дууссан бол шинэ токен авах
            const response = await axios.post(
                url,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${auth}`,
                    },
                }
            );

            if (response.status === 200) {
                const newToken = response.data.access_token;
                const expiresIn = response.data.access_token_expires_in; 
                const newExpiresAt = new Date(Date.now() + expiresIn * 800);

                const insertOrUpdateQuery = `
                    UPDATE khanbank_token SET access_token = ?, expires_at = ?
                    WHERE id = 1
                `;
                await executeQuery(insertOrUpdateQuery, [newToken, newExpiresAt]);

                return res.status(200).json({
                    success: true,
                    message: "Токен амжилттай шинэчлэгдсэн",
                });
            } else {
                return res.status(500).json({
                    success: false,
                    data: null,
                    message: "Токен авахад алдаа гарлаа"
                });
            }
        } else {
            return res.status(200).json({
                success: true,
                message: "Токен хүчинтэй байна",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа"
        });
    }
};

module.exports = GATEWAY_TOKEN;
