import React from 'react';
import HeroSection from '../../../components/layout/Hero-section'
import StatsBar from '../components/StatsBar.jsx';
import StepsSection from '../components/StepsSection.jsx';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* 
          HeroSection is the star of the show here.
          The min-h calculation accounts for the Navbar height 
          to ensure perfect centering if needed.
      */}
      <HeroSection />
      <StepsSection/>
      <StatsBar/>
      
      {/* 
          Since you only want the HeroSection, 
          you can add a simple spacer here if you want to 
          ensure the Footer doesn't feel cramped.
      */}
      {/* <div className="bg-background-soft h-20 w-full"></div> */}
    </div>
  );
};

export default HomePage;