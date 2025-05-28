import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Home } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import useAuthStore from '../stores/auth-store';
import styles from '../styles/adminSettings.module.css';

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearUser);

  const handleLogout = () => {
    logout()
    localStorage.removeItem("token")
    navigate('/auth');
  };

  const goToHomepage = () => {
    navigate('/');
  };

  return (
    <div className={styles.adminPageContainer}>
      <AdminSidebar user={user} />
      
      <main className={styles.adminMainContent}>
        <div className={styles.settingsHeader}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className={styles.settingsContainer}>
          <div className={styles.settingsCard}>
            <h2>Account Settings</h2>
            <div className={styles.settingsActions}>
              <button 
                className={styles.settingButton} 
                onClick={goToHomepage}
              >
                <Home size={20} />
                <span>Go to Homepage</span>
              </button>
              
              <button 
                className={styles.logoutButton} 
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettingsPage;
