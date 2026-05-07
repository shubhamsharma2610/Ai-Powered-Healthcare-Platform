import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout.jsx';

import HomePage from './features/home/pages/HomePage.jsx';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AiAssistant from './features/ai-assistant/pages/AiAssistant';
import Services from './features/services/pages/Services';
import FindDoctor from './features/patient/pages/FindDoctor';
import PatientDashboard from './features/patient/pages/PatientDashboard';
import EditProfile from './features/patient/pages/EditProfile';
import PatientProfileSetup from './features/patient/pages/PatientProfileSetup';

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const isAuth = true;

  return (
    <Routes>

      {/* Dashboard WITHOUT Navbar/Footer */}
      // Patient Dashboard - NO MainLayout (full screen)
<Route element={<ProtectedRoute isAuthenticated={isAuth} />}>
  <Route path="/patient/dashboard" element={<PatientDashboard />} />
</Route>

// Public Routes - WITH MainLayout (navbar + spacing)
<Route element={<MainLayout />}>  // ✅ Default pt-20 spacing
  <Route path="/" element={<HomePage />} />
  <Route path="/services" element={<Services />} />  // ✅ Fixed
  <Route path="/ai-assistant" element={<AiAssistant />} />
</Route>

      {/* Auth Pages WITHOUT Navbar/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

    </Routes>
  );
};

export default AppRoutes;