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
    console.log(query)
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

// Create new product
const createProduct = async (req, res) => {
    try {
        console.log("Request body:", JSON.stringify(req.body, null, 2)); // Pretty print the request
        const productData = req.body;
        
        // Create new product instance
        const newProduct = new productSchema(productData);
        
        // Validate the product against the schema
        const validationError = newProduct.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: validationError.message
            });
        }
        
        // Save to database
        console.log("Attempting to save product...");
        const savedProduct = await newProduct.save();
        console.log("Product saved successfully:", savedProduct._id);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: savedProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false, 
            message: 'Failed to create product',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if it's a MongoDB ObjectId or a custom ID
    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.id = id;
    }
    
    // Find and delete the product
    const deletedProduct = await productSchema.findOneAndDelete(query);
    
    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log("Updating product:", id);
    console.log("Update data:", updateData);
    
    // Check if it's a MongoDB ObjectId or a custom ID
    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.id = id;
    }
    
    // Find and update the product
    const updatedProduct = await productSchema.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  getProductsbyCategory,
  getAllProducts,
<<<<<<< HEAD
  getProductById
};
=======
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct
};
>>>>>>> a0efa8fedb5f15b104b001969652cca1b6633168
