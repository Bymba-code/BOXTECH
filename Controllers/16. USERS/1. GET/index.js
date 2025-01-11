const { executeQuery } = require("../../../Database/test");

const GET_USERS = async (req, res) => {
  try {
    const { pages, size } = req.query;
    const pageNumber = parseInt(pages) || 1;  
    const sizeNumber = parseInt(size) || 10; 

    const offset = (pageNumber - 1) * sizeNumber;

    if (isNaN(pageNumber) || isNaN(sizeNumber) || pageNumber <= 0 || sizeNumber <= 0) {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Хуудасны эсвэл хэмжээг зөв оруулна уу.",
        });
      }

    const countQuery = `SELECT COUNT(DISTINCT u.id) as total_users 
                        FROM users u
                        LEFT JOIN products p ON u.id = p.user`;

    const totalCountResult = await executeQuery(countQuery);
    const totalUsers = totalCountResult[0].total_users;
    const totalPages = Math.ceil(totalUsers / sizeNumber);  

    const query = `SELECT 
                    u.*, 
                    COUNT(p.id) as total_files
                    FROM users u 
                    LEFT JOIN products p ON u.id = p.user
                    GROUP BY u.id
                    LIMIT ? OFFSET ?`;

    const data = await executeQuery(query, [sizeNumber.toString(), offset.toString()]); 

    return res.status(200).json({
      success: true,
      data: data,
      maxPages: totalPages, 
      currentPage: pageNumber,
      message: "Амжилттай"
    });
  } catch (err) {
    console.error(err); 
    return res.status(500).json({
      success: false,
      data: [],
      message: "Серверийн алдаа " + err
    });
  }
};

module.exports = GET_USERS;
