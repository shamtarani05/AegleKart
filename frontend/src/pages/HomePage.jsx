import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection/>
      <Categories/>
      <Footer />
    </>
  );
};

export default HomePage;
