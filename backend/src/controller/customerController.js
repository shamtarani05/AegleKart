const User = require('../models/user-schema');
const Order = require('../models/order-schema');
const Payment = require('../models/payment-schema');

/**
 * Get all customers with order history and spending data
 */
exports.getAllCustomers = async (req, res) => {
  try {
    // Fetch all users with role "user"
    const users = await User.find({ role: 'user' }).select('-password');
    
    const customersWithDetails = await Promise.all(users.map(async (user) => {
      // Get all orders for this user
      const orders = await Order.find({ "customer.email": user.email });
      
      // Calculate total spent across all orders
      const totalSpent = orders.reduce((total, order) => total + (order.total || 0), 0);
      
      // Get last order date
      const lastOrder = orders.length > 0 
        ? orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt
        : null;
      
      // Try to get location from the most recent order's shipping address
      let location = "N/A";
      if (orders.length > 0) {
        const recentOrder = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        if (recentOrder.shippingAddress) {
          const address = recentOrder.shippingAddress;
          const city = address.city || '';
          const state = address.state || '';
          
          if (city && state) {
            location = `${city}, ${state}`;
          } else if (city) {
            location = city;
          } else if (state) {
            location = state;
          }
        }
      }
      
      return {
        id: user._id,
        name: user.fullName || 'Unknown',
        email: user.email,
        phone: user.phoneNumber || 'N/A',
        totalOrders: orders.length,
        totalSpent: totalSpent,
        lastOrder: lastOrder,
        joinDate: user.createdAt,
        location: location
      };
    }));
    
    return res.status(200).json({
      success: true,
      count: customersWithDetails.length,
      data: customersWithDetails
    });
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Get single customer details with order history
 */
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Find the user
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    // Get all orders for this user
    const orders = await Order.find({ "customer.email": user.email });
    
    // Get payment history
    const payments = await Payment.find({ "customer.email": user.email });
    
    // Calculate financial metrics
    const totalSpent = orders.reduce((total, order) => total + (order.total || 0), 0);
    const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
    
    // Group orders by status for order analytics
    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status || 'pending';
      if (!acc[status]) acc[status] = 0;
      acc[status]++;
      return acc;
    }, {});
    
    // Get most recent order details
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
      
    // Try to get location from the most recent order's shipping address
    let location = "N/A";
    if (orders.length > 0) {
      const recentOrder = orders[0];
      if (recentOrder.shippingAddress) {
        const address = recentOrder.shippingAddress;
        const city = address.city || '';
        const state = address.state || '';
        
        if (city && state) {
          location = `${city}, ${state}`;
        } else if (city) {
          location = city;
        } else if (state) {
          location = state;
        }
      }
    }
    
    // Build the detailed customer profile
    const customerDetails = {
      id: user._id,
      name: user.fullName || 'Unknown',
      email: user.email,
      phone: user.phoneNumber || 'N/A',
      joinDate: user.createdAt,
      location: location,
      analytics: {
        totalOrders: orders.length,
        totalSpent: totalSpent,
        averageOrderValue: averageOrderValue,
        ordersByStatus: ordersByStatus,
      },
      recentOrders: recentOrders,
      paymentHistory: payments.slice(0, 5) // Get 5 most recent payments
    };
    
    return res.status(200).json({
      success: true,
      data: customerDetails
    });
    
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
