import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({
  noPadding = false,
  showNavbar = true,
  showFooter = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Navbar */}
      {showNavbar && (
        <Navbar isAuthenticated={true} role="patient" />
      )}

      {/* Main Content */}
      <main
        className={
          noPadding
            ? 'flex-1 overflow-hidden'
            : 'flex-grow pt-10'
        }
      >
        <Outlet />
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

    </div>
  );
};

export default MainLayout;