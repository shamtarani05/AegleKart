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
import Feedback from "./pages/Feedback"
import ProductsPage from "./pages/ProductsPage";

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
      {/* Redirect root to auth */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/cart" element={<CartPage/>}/>
      <Route path="/terms" element={<TermsOfService/>}/>
      <Route path="/feedback" element={<Feedback/>}/>
      <Route path = "/products/:category" element={<ProductsPage/>}/>
    </Routes>
  );
} 

export default App;
