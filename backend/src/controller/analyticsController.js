const Order = require('../models/order-schema');
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
      
      // Directly aggregate by products.category from order data
      const categoryData = await Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.category",
            totalSold: { $sum: "$products.quantity" }
          }
        },
        { $match: { _id: { $ne: null } } }, // Exclude null categories
        { $sort: { totalSold: -1 } },
        { $limit: 5 } // Get only top 5 categories
      ]);
    
      // Use fixed colors for consistent visualization
      const colors = ['#4e6af3', '#10ca93', '#f39c12', '#9b59b6', '#e74c3c', '#3498db'];
      
      // Replace null or empty category with "Uncategorized"
      // And format for the pie chart component
      const formattedData = categoryData.map((item, index) => ({
        name: item._id || 'Uncategorized',
        value: item.totalSold,
        color: colors[index % colors.length]
      }));

      // Calculate total for percentage calculation
      const total = formattedData.reduce((sum, item) => sum + item.value, 0);
      
      // Add percentage to each category
      const result = formattedData.map(item => ({
        ...item,
        // Convert raw value to percentage of total
        value: total > 0 ? Math.round((item.value / total) * 100) : 0
      }));
      
      // If no categories were found, return a default "Uncategorized" with 100%
      if (result.length === 0) {
        return res.status(200).json([
          { name: 'Uncategorized', value: 100, color: '#4e6af3' }
        ]);
      }

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
