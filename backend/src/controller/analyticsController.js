const Order = require('../models/Order');
const Product = require('../models/product-schema');

// Get dashboard summary statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Calculate total revenue, orders count by status
    const orderStats = await Order.aggregate([
      {
        $facet: {
          // Total revenue from all orders
          "totalRevenue": [
            {
              $match: { status: { $ne: "Cancelled" } } // Exclude cancelled orders
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$total" }
              }
            }
          ],
          // Monthly revenue for current month
          "monthlySales": [
            {
              $match: {
                status: { $ne: "Cancelled" },
                createdAt: { $gte: new Date(new Date().setDate(1)) } // First day of current month
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$total" }
              }
            }
          ],
          // Count orders by status
          "ordersByStatus": [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    // Structure the response
    const response = {
      totalRevenue: orderStats[0].totalRevenue.length > 0 ? orderStats[0].totalRevenue[0].total : 0,
      monthlySales: orderStats[0].monthlySales.length > 0 ? orderStats[0].monthlySales[0].total : 0,
      ordersCompleted: 0,
      pendingOrders: 0
    };

    // Add order counts by status
    orderStats[0].ordersByStatus.forEach(statusGroup => {
      if (statusGroup._id === "Delivered") {
        response.ordersCompleted = statusGroup.count;
      } else if (statusGroup._id === "Pending") {
        response.pendingOrders = statusGroup.count;
      }
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error('Error getting dashboard stats:', err);
    return res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

// Get monthly revenue data for the last 6 months
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Last 6 months
    sixMonthsAgo.setDate(1); // Start of the month
    
    const monthlyData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$total" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format the response for the chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const formattedData = monthlyData.map(item => ({
      month: months[item._id.month - 1],
      revenue: item.revenue
    }));

    return res.status(200).json(formattedData);
  } catch (err) {
    console.error('Error getting monthly revenue:', err);
    return res.status(500).json({ error: 'Failed to fetch monthly revenue data' });
  }
};

// Get product category distribution for pie chart
exports.getProductCategoryDistribution = async (req, res) => {
  try {
    // First get all orders with their items
    const orderItemsData = await Order.aggregate([
      {
        $match: { status: { $ne: "Cancelled" } }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: "$products.category",
          totalSold: { $sum: "$products.quantity" }
        }
      }
    ]);

    // Extract product IDs to get their categories
    const productIds = orderItemsData.map(item => item._id);
    
    // Get product categories
    const products = await Product.find({ _id: { $in: productIds } }, 'category');
    
    // Create a map of product ID to category
    const productCategories = {};
    products.forEach(product => {
      productCategories[product._id] = product.category;
    });
    
    // Aggregate sales by category
    const categorySales = {};
    orderItemsData.forEach(item => {
      const category = productCategories[item._id] || 'Uncategorized';
      if (!categorySales[category]) {
        categorySales[category] = 0;
      }
      categorySales[category] += item.totalSold;
    });
    
    // Format for pie chart
    const result = Object.keys(categorySales).map(category => ({
      name: category,
      value: categorySales[category]
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error getting category distribution:', err);
    return res.status(500).json({ error: 'Failed to fetch product category distribution' });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('customer', 'name email');
      
    return res.status(200).json(recentOrders);
  } catch (err) {
    console.error('Error getting recent orders:', err);
    return res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
};
