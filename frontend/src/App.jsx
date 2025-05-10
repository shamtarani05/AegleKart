import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
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
import useAuthStore from "./stores/auth-store";

// Admin Route protection component
const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = useAuthStore((state) => state.isAdmin());
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
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
        // <ProtectedAdminRoute>
          <AdminDashboard />
        //  </ProtectedAdminRoute> 
      } />
      <Route path="/admin/products" element={
        // <ProtectedAdminRoute>
          <AdminProductsPage />
        // </ProtectedAdminRoute>
      } />
      <Route path="/admin/orders" element={
        // <ProtectedAdminRoute>
          <AdminOrdersPage />
        // </ProtectedAdminRoute>
      } />
      <Route path="/admin/customers" element={
        // <ProtectedAdminRoute>
          <AdminCustomersPage />
        // </ProtectedAdminRoute>
      } />
      <Route path="/admin/coupons" element={
        // <ProtectedAdminRoute>
          <AdminCouponsPage />
        // </ProtectedAdminRoute>
      } />
      <Route path="/admin/add-product" element={
        // <ProtectedAdminRoute>
          <AddProductPage />
        // </ProtectedAdminRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
    </Routes>
  );
} 

export default App;
