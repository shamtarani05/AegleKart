import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign,
  ShoppingBag,
  Package,
  AlertCircle,
  Plus
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAuthStore from '../stores/auth-store';
import styles from '../styles/adminDashboard.module.css';

// Import the new components
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import SalesChart from '../components/admin/SalesChart';
import ProductPieChart from '../components/admin/ProductPieChart';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
  
  // Mock data for statistics
  const salesData = {
    totalRevenue: 125000,
    monthlySales: 42500,
    ordersCompleted: 189,
    pendingOrders: 23
  };

  // Mock data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18500 },
    { month: 'Mar', revenue: 21000 },
    { month: 'Apr', revenue: 19000 },
    { month: 'May', revenue: 22500 },
    { month: 'Jun', revenue: 25000 }
  ];

  // Mock data for recent orders
  const recentOrders = [
    {
      id: '#AEG12345',
      customer: 'Raj Sharma',
      products: '3 items',
      total: '₹1,250',
      status: 'Pending'
    },
    {
      id: '#AEG12344',
      customer: 'Priya Patel',
      products: '2 items',
      total: '₹890',
      status: 'Delivered'
    },
    {
      id: '#AEG12343',
      customer: 'Amit Kumar',
      products: '5 items',
      total: '₹2,100',
      status: 'Shipped'
    },
    {
      id: '#AEG12342',
      customer: 'Sneha Gupta',
      products: '1 item',
      total: '₹550',
      status: 'Delivered'
    }
  ];

  return (
    <div className={styles.adminPageContainer}>
      
      <div className={styles.adminContentWrapper}>
        <AdminSidebar user={user} />
        
        <main className={styles.adminMainContent}>
          <div className={styles.adminHeader}>
            <h1>Admin Dashboard</h1>
            <div className={styles.adminActions}>
              <Link to="/admin/add-product" className={styles.addProductButton}>
                <Plus size={16} />
                <span>Add Products</span>
              </Link>
            </div>
          </div>
          
          <div className={styles.statsGrid}>
            <StatCard 
              icon={<DollarSign size={24} className={styles.statIcon} />}
              title="Total Revenue"
              value={`₹${salesData.totalRevenue.toLocaleString()}`}
              trend={{ text: '+8% from last month' }}
            />
            
            <StatCard 
              icon={<ShoppingBag size={24} className={styles.statIcon} />}
              title="Monthly Sales"
              value={`₹${salesData.monthlySales.toLocaleString()}`}
              trend={{ text: '+5.2% from last month' }}
              iconClassName={styles.iconGreen}
            />
            
            <StatCard 
              icon={<Package size={24} className={styles.statIcon} />}
              title="Orders Completed"
              value={salesData.ordersCompleted}
              trend={{ text: 'Last 30 days', icon: null }}
              iconClassName={styles.iconPurple}
            />
            
            <StatCard 
              icon={<AlertCircle size={24} className={styles.statIcon} />}
              title="Pending Orders"
              value={salesData.pendingOrders}
              trend={{ text: 'Requires action', icon: null }}
              iconClassName={styles.iconOrange}
            />
          </div>
          
          <div className={styles.chartsContainer}>
            <SalesChart data={monthlyRevenue} />
            <ProductPieChart />
          </div>
          
          <RecentOrdersTable orders={recentOrders} />
        </main>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
