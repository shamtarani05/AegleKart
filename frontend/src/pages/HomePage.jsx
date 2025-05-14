import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import TopSellingProducts from "../components/TopSellingProducts";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection/>
      <TopSellingProducts />
      <Categories/>
      <Footer />
    </>
  );
};

export default HomePage;
