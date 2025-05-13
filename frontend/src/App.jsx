import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FAQs from "./pages/FAQs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Auth from "./pages/Auth";
import CartPage from "./pages/CartPage";
import TermsOfService from "./pages/TermsOfService";
import Feedback from "./pages/Feedback";
import ProductsPage from "./pages/ProductsPage";
import MedicineDescriptionPage from "./pages/MedicineDescriptionPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminCustomersPage from "./pages/AdminCustomersPage";
import AdminCouponsPage from "./pages/AdminCouponsPage";
import AddProductPage from "./pages/AddProductPage";
import { jwtDecode } from 'jwt-decode';
import NotFound from "./pages/NotFound";
import StoreLocator from "./pages/StoreLocator";
import Blog from "./pages/Bolgs";
import CareerPage from "./pages/CareerPage";
import LoadingState from "./components/common/LoadingState";




function App() {
  const ProtectedAdminRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/auth/login'); // or redirect to homepage
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === 'admin') {
          setIsAuthorized(true);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("Token decoding failed:", err);
        navigate('/auth/login');
      }
    }, [navigate]);

    // You can show a loader or return null while checking authorization
    if (isAuthorized === null) return setTimeout(() => {
      <LoadingState message="Checking Acces Please Wait..." />
    }, 1000);

    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/faq" element={<FAQs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/returns" element={<ReturnPolicy />} />
      <Route path="/shipping" element={<ShippingPolicy />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/products/:category" element={<ProductsPage />} />
      <Route path="/description" element={<MedicineDescriptionPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedAdminRoute>
          <AdminProductsPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedAdminRoute>
          <AdminOrdersPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/customers" element={
        <ProtectedAdminRoute>
          <AdminCustomersPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/coupons" element={
        <ProtectedAdminRoute>
          <AdminCouponsPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/add-product" element={
        <ProtectedAdminRoute>
          <AddProductPage />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      <Route path="/stores" element={<StoreLocator />} />
      <Route path='/blog' element={<Blog />} />
      <Route path='/careers' element={<CareerPage />} />
      <Route path='/*' element={<NotFound />} />
      <Route path='product/:id' element={<MedicineDescriptionPage />} />
    </Routes>
  );
}

export default App;
