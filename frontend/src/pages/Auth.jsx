import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../components/Auth/ForgotPassword';
import OTPVerification from '../components/Auth/OTPVerification';
import ResetPassword from '../components/Auth/ResetPassword';
import styles from '../styles/auth.module.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  // Toggle between login and register tabs
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  // For handling OTP flow with proper state
  const [verificationState, setVerificationState] = useState({
    email: '',
    phone: '',
    isFromForgotPassword: false
  });

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className={styles.authContainer}> 
            <div className={styles.authCard}>
              <div className={styles.authTabs}>
                <button
                  className={`${styles.tabButton} ${activeTab === 'login' ? styles.activeTab : ''}`}
                  onClick={() => toggleTab('login')}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`${styles.tabButton} ${activeTab === 'register' ? styles.activeTab : ''}`}
                  onClick={() => toggleTab('register')}
                  type="button"
                >
                  Register
                </button>
              </div>
              
              <div className={styles.authContent}>
                {activeTab === 'login' ? (
                  <Login 
                    navigateToForgotPassword={() => navigate('/auth/forgot-password')} 
                  />
                ) : (
                  <Register 
                    onRegisterSuccess={(email, phone) => {
                      setVerificationState({
                        email,
                        phone: phone || '',
                        isFromForgotPassword: false
                      });
                      navigate('/auth/verify-otp');
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        } 
      />
      
      <Route 
        path="/forgot-password" 
        element={
          <ForgotPassword 
            onBackClick={() => navigate('/auth')}
            navigateToOTP={(email, phone) => {
              setVerificationState({
                email: email || '',
                phone: phone || '',
                isFromForgotPassword: true
              });
              navigate('/auth/verify-otp');
            }}
          />
        } 
      />
      
      <Route 
        path="/verify-otp" 
        element={
          <OTPVerification 
            email={verificationState.email}
            phone={verificationState.phone}
            onBackClick={() => {
              navigate(verificationState.isFromForgotPassword ? 
                '/auth/forgot-password' : 
                '/auth'
              );
            }}
            onVerificationComplete={() => {
              if (verificationState.isFromForgotPassword) {
                navigate('/auth/reset-password');
              } else {
                // For registration flow, redirect to login with success message
                setActiveTab('login');
                navigate('/auth');
                // You might want to add a success notification here
              }
            }}
          />
        } 
      />
      
      <Route 
        path="/reset-password" 
        element={
          <ResetPassword 
            email={verificationState.email}
            onResetComplete={() => {
              setActiveTab('login');
              navigate('/auth');
              // You might want to add a success notification here
            }}
            onBackClick={() => navigate('/auth')}
          />
        } 
      />
      
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default Auth;