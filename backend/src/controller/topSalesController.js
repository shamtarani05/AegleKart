const mongoose = require('mongoose');
const productSchema = require('../models/product-schema');

// Fetch top 10 products by sales
const getTopSales = async (req, res) => {
  try {
    console.log("Attempting to fetch top sales...");
    
    // Check if sales collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const salesCollectionExists = collections.some(c => c.name === 'sales');
    
    if (!salesCollectionExists) {
      console.log("Sales collection does not exist in the database.");
      return res.status(404).json({ message: "Sales data not found." });
    }
    
    // Aggregate top 10 products by sales count from the sales collection
    const topSales = await mongoose.connection.collection('sales').aggregate([
      { $group: { _id: "$product_id", totalSales: { $sum: "$quantity_sold" } } },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    console.log(`Found ${topSales.length} top selling products from sales data:`);
    console.log(topSales.map(s => ({ id: s._id, sales: s.totalSales })));
    
    if (topSales.length === 0) {
      console.log("No sales data found.");
      
      // Return some fallback products instead of an empty array
      const fallbackProducts = await productSchema.find({})
        .limit(10)
        .select('_id name brandName price discountedPrice discount images stockStatus');
        
      console.log(`Using ${fallbackProducts.length} fallback products instead.`);
      
      return res.status(200).json(fallbackProducts);
    }

    // Extract product IDs from the aggregation result - handling both string IDs and ObjectIds
    const productIds = topSales.map((sale) => {
      // Try to convert to ObjectId if it's a string that looks like an ObjectId
      try {
        if (typeof sale._id === 'string' && /^[0-9a-fA-F]{24}$/.test(sale._id)) {
          return mongoose.Types.ObjectId(sale._id);
        }
        // Otherwise return as is
        return sale._id;
      } catch (err) {
        console.warn(`Failed to convert ID ${sale._id} to ObjectId:`, err.message);
        return sale._id;
      }
    });
    
    console.log("Looking for products with IDs:", productIds);
    
    // Try different queries to find the products
    let products = [];
    
    // First try with _id
    products = await productSchema.find(
      { _id: { $in: productIds } },
      {
        _id: 1,
        name: 1,
        brandName: 1,
        price: 1,
        discountedPrice: 1,
        discount: 1,
        images: 1,
        stockStatus: 1
      }
    );
    
    console.log(`Found ${products.length} products using _id matching.`);
    
    // If no products found, try with the 'id' field instead
    if (products.length === 0) {
      // Get string versions of IDs
      const stringIds = topSales.map(sale => sale._id.toString());
      
      products = await productSchema.find(
        { id: { $in: stringIds } },
        {
          _id: 1,
          id: 1,
          name: 1,
          brandName: 1,
          price: 1,
          discountedPrice: 1,
          discount: 1,
          images: 1,
          stockStatus: 1
        }
      );
      
      console.log(`Found ${products.length} products using id field matching.`);
    }
    
    // Map sales data to product details
    const topSellingProducts = topSales.map((sale) => {
      // Try to find product by either _id or id field
      const product = products.find(
        (p) => (p._id.toString() === sale._id.toString()) || 
               (p.id && p.id.toString() === sale._id.toString())
      );
      
      if (!product) {
        console.warn(`Product with ID ${sale._id} not found in the product collection.`);
        return null;
      }
      
      return { ...product.toObject(), totalSales: sale.totalSales };
    }).filter(Boolean); // Remove null entries
    
    if (topSellingProducts.length === 0) {
      console.log("No matching products found for the top sales. Using fallback products...");
      
      // Return some fallback products
      const fallbackProducts = await productSchema.find({})
        .limit(10)
        .select('_id name brandName price discountedPrice discount images stockStatus');
        
      return res.status(200).json(fallbackProducts);
    }
    
    console.log(`Returning ${topSellingProducts.length} top selling products.`);
    res.status(200).json(topSellingProducts);
    
  } catch (error) {
    console.error("Error fetching top sales:", error);
    
    // On error, return a fallback list of products
    try {
      const fallbackProducts = await productSchema.find({})
        .limit(10)
        .select('_id name brandName price discountedPrice discount images stockStatus');
        
      console.log("Returning fallback products due to error.");
      res.status(200).json(fallbackProducts);
    } catch (fallbackError) {
      console.error("Error fetching fallback products:", fallbackError);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = { getTopSales };
