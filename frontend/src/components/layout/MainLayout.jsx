import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={true} role="patient" /> 
      <main className="flex-grow pt-20">
        {/* Outlet yahan AppRoutes ke children ko render karega */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;