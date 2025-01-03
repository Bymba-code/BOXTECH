const { executeQuery } = require("../../../Database/test");

const GET_ALL_PRODUCT = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber <= 0 || pageSize <= 0) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Хуудасны эсвэл хэмжээг зөв оруулна уу.",
      });
    }

    const offset = (pageNumber - 1) * pageSize;

    // Base query
    let query = `SELECT 
                   products.*,
                   category.name AS category_name,
                   users.id AS owner_id,
                   users.username,
                   COUNT(DISTINCT product_reviews.id) AS review_count,
                   AVG(product_rating.rating) AS average_rating
                 FROM 
                   products
                 LEFT JOIN category ON category.id = products.category
                 LEFT JOIN 
                   users ON products.user = users.id
                 LEFT JOIN 
                   product_reviews ON products.id = product_reviews.product
                 LEFT JOIN 
                   product_rating ON products.id = product_rating.product`;

    // Add category filtering if category is provided
    const queryParams = [];
    if (category && category !== "all") {
      query += ` WHERE products.category = ?`;
      queryParams.push(category);
    }

    // Add grouping, sorting, and pagination
    query += ` 
                 GROUP BY 
                   products.id, users.id, users.username
                 LIMIT ? OFFSET ?`;

    queryParams.push(pageSize, offset.toString());

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Өгөгдөл олдсонгүй",
      });
    }

    // Count total products with or without category filter
    let countQuery = `SELECT COUNT(products.id) AS total_products 
                      FROM products`;

    const countQueryParams = [];
    if (category && category !== "all") {
      countQuery += ` WHERE products.category = ?`;
      countQueryParams.push(category);
    }

    const countResult = await executeQuery(countQuery, countQueryParams);
    const totalProducts = countResult[0]?.total_products || 0;

    // Calculate total pages based on total products and page size
    const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / pageSize) : 1;

    // Debugging to verify the query output
    console.log("Count Query:", countQuery);
    console.log("Count Params:", countQueryParams);
    console.log("Total Products:", totalProducts);
    console.log("Total Pages:", totalPages);

    return res.status(200).json({
      success: true,
      data: data,
      currentPage: pageNumber,
      totalProducts: totalProducts,
      totalPages: totalPages,
      limit: pageSize,
      message: "Амжилттай",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Серверийн алдаа гарлаа : " + err,
    });
  }
};

module.exports = GET_ALL_PRODUCT;
