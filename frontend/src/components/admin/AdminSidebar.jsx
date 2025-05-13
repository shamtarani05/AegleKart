import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Package, 
  ShoppingBag, 
  Users,
  Tag,
  Truck,
  Settings
} from 'lucide-react';
import styles from '../../styles/adminDashboard.module.css';

const AdminSidebar = ({ user }) => {
  // Use location to determine current page
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Helper function to check if a link is active
  const isActive = (path) => {
    if (path === '/admin' && currentPath === '/admin') return true;
    if (path !== '/admin' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className={styles.adminSidebar}>
      <div className={styles.adminProfile}>
        <div className={styles.adminAvatar}>
          {user?.fullName?.charAt(0) || "A"}
        </div>
        <div className={styles.adminInfo}>
          <h3>{user?.fullName || "Admin User"}</h3>
          <p>Administrator</p>
        </div>
      </div>
      
      <nav className={styles.adminNav}>
        <Link 
          to="/admin" 
          className={`${styles.adminNavLink} ${isActive('/admin') && currentPath === '/admin' ? styles.active : ''}`}
        >
          <BarChart size={18} />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/admin/products" 
          className={`${styles.adminNavLink} ${isActive('/admin/products') ? styles.active : ''}`}
        >
          <Package size={18} />
          <span>Products</span>
        </Link>
        <Link 
          to="/admin/orders" 
          className={`${styles.adminNavLink} ${isActive('/admin/orders') ? styles.active : ''}`}
        >
          <ShoppingBag size={18} />
          <span>Orders</span>
        </Link>
        <Link 
          to="/admin/customers" 
          className={`${styles.adminNavLink} ${isActive('/admin/customers') ? styles.active : ''}`}
        >
          <Users size={18} />
          <span>Customers</span>
        </Link>
        <Link 
          to="/admin/coupons" 
          className={`${styles.adminNavLink} ${isActive('/admin/coupons') ? styles.active : ''}`}
        >
          <Tag size={18} />
          <span>Discount Coupons</span>
        </Link>
        {/* <Link 
          to="/admin/shipping" 
          className={`${styles.adminNavLink} ${isActive('/admin/shipping') ? styles.active : ''}`}
        >
          <Truck size={18} />
          <span>Shipping</span>
        </Link> */}
        <Link 
          to="/admin/settings" 
          className={`${styles.adminNavLink} ${isActive('/admin/settings') ? styles.active : ''}`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
