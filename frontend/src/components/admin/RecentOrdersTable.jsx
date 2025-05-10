import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/adminDashboard.module.css';

const RecentOrdersTable = ({ orders }) => {
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
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.products}</td>
                <td>{order.total}</td>
                <td>
                  <span className={styles[`status${order.status}`]}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className={styles.viewButton}>View</button>
                </td>
              </tr>
            ))}
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
