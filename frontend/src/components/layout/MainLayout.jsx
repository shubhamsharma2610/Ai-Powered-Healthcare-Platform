import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ noPadding = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={true} role="patient" />
      
      <main className={noPadding ? "flex-1 overflow-hidden" : "flex-grow pt-10"}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};


export default MainLayout;