const productSchema = require('../models/product-schema');

const getProductsbyCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 25 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const categoryRegex = new RegExp(`^${category}$`, 'i');

    const totalCount = await productSchema.countDocuments({ category: categoryRegex });

    const products = await productSchema.find(
      { category: categoryRegex },
      {
        name: 1,
        brandName: 1,
        category: 1,
        price: 1,
        description: 1,
        images: 1,
        discountedPrice: 1,
        discount: 1,
        rating: 1,
        stockStatus: 1,
        deliveryTime: 1,
        id: 1,
        manufacturer: 1
      }
    )
    .skip(skip)
    .limit(limitNumber)
    .sort({ id: 1 });

    res.status(200).json({
      products,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber)
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getProductsbyCategory
};