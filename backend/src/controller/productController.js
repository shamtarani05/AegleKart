const productSchema = require('../models/product-schema');

// Get products by category
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

// Get all products with pagination and optional filters
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter query
    let query = {};

    // Apply category filter if provided
    if (category && category !== 'All Products') {
      query.category = new RegExp(category, 'i');
    }

    // Apply search filter if provided
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { id: new RegExp(search, 'i') }
      ];
    }

    // Get total count for pagination
    const totalCount = await productSchema.countDocuments(query);

    // Fetch products based on filters
    const products = await productSchema.find(
      query,
      {
        id: 1,
        name: 1,
        brandName: 1,
        category: 1,
        price: 1,
        discountedPrice: 1,
        quantity: 1,
        stockStatus: 1,
        prescriptionRequired: 1,
        images: 1,
        _id: 1
      }
    )
    .skip(skip)
    .limit(limitNumber)
    .sort({ _id: -1 });  // Sort by newest first

    res.status(200).json({
      products,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber)
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = {};
    
    // Check if it's a MongoDB ObjectId or a custom ID
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.id = id;
    }
    
    const product = await productSchema.findOne(query);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getProductsbyCategory,
  getAllProducts,
  getProductById
};
