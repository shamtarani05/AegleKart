import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign,
  ShoppingBag,
  Package,
  AlertCircle,
  Plus
} from 'lucide-react';
import useAuthStore from '../stores/auth-store';
import styles from '../styles/adminDashboard.module.css';

// Import components
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import SalesChart from '../components/admin/SalesChart';
import ProductPieChart from '../components/admin/ProductPieChart';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import ErrorState from '../components/common/ErrorState';
import LoadingState from '../components/common/LoadingState';

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
  
  // State for API data
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    monthlySales: 0,
    ordersCompleted: 0,
    pendingOrders: 0
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from APIs
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all required data in parallel
      const [statsRes, revenueRes, categoryRes, ordersRes] = await Promise.all([
        fetch('http://localhost:3000/dashboard/stats'),
        fetch('http://localhost:3000/dashboard/monthly-revenue'),
        fetch('http://localhost:3000/dashboard/category-distribution'),
        fetch('http://localhost:3000/dashboard/recent-orders')
      ]);
      
      // Check if any request failed
      if (!statsRes.ok || !revenueRes.ok || !categoryRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      // Parse all responses
      const stats = await statsRes.json();
      const revenue = await revenueRes.json();
      const category = await categoryRes.json();
      const orders = await ordersRes.json();
      
      // Update state with fetched data
      setDashboardStats(stats);
      setMonthlyRevenue(revenue);
      setCategoryDistribution(category);
      setRecentOrders(formatOrdersForTable(orders));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format orders data for the recent orders table
  const formatOrdersForTable = (ordersData) => {
    if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
      return [];
    }
    
    return ordersData.map(order => ({
      id: order.orderId || order._id,
      customer: order.customer?.name || 'Unknown Customer',
      products: `${order.items?.length || 0} items`,
      total: `PKR ${(order.total || 0).toLocaleString()}`,
      status: order.status || 'Unknown'
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.adminContentWrapper}>
          <AdminSidebar user={user} />
          <main className={styles.adminMainContent}>
            <LoadingState message="Loading dashboard data..." />
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.adminContentWrapper}>
          <AdminSidebar user={user} />
          <main className={styles.adminMainContent}>
            <ErrorState error={error} onRetry={fetchDashboardData} />
          </main>
        </div>
      </div>
    );
  }

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
              value={`PKR ${dashboardStats.totalRevenue.toLocaleString()}`}
              trend={{ text: 'All time revenue' }}
            />
            
            <StatCard 
              icon={<ShoppingBag size={24} className={styles.statIcon} />}
              title="Monthly Sales"
              value={`PKR ${dashboardStats.monthlySales.toLocaleString()}`}
              trend={{ text: 'This month' }}
              iconClassName={styles.iconGreen}
            />
            
            <StatCard 
              icon={<Package size={24} className={styles.statIcon} />}
              title="Orders Completed"
              value={dashboardStats.ordersCompleted}
              trend={{ text: 'Total delivered orders' }}
              iconClassName={styles.iconPurple}
            />
            
            <StatCard 
              icon={<AlertCircle size={24} className={styles.statIcon} />}
              title="Pending Orders"
              value={dashboardStats.pendingOrders}
              trend={{ text: 'Requires action' }}
              iconClassName={styles.iconOrange}
            />
          </div>
          
          <div className={styles.chartsContainer}>
            <SalesChart data={monthlyRevenue} />
            <ProductPieChart data={categoryDistribution} />
          </div>
          
          <RecentOrdersTable orders={recentOrders} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
