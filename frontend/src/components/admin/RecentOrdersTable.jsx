import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/adminDashboard.module.css';

const RecentOrdersTable = ({ orders }) => {
  const navigate = useNavigate();
  
  const handleViewOrder = (orderId) => {
    navigate(`/admin/order-details/${orderId}`);
  };
  
  return (
    <div className={styles.recentActivitySection}>
      <h3>Recent Orders</h3>
      <div className={styles.activityTable}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                  No recent orders to display
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.products}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.viewButton}
                      onClick={() => handleViewOrder(order.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.viewAllContainer}>
        <Link to="/admin/orders" className={styles.viewAllLink}>
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
