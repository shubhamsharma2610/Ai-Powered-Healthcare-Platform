import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import HomePage from './features/home/pages/HomePage.jsx';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AiAssistant from './features/ai-assistant/pages/AiAssistant';
import Services from './features/services/pages/Services';
import FindDoctor from './features/patient/pages/FindDoctor';
// Protected Route Component
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
  // Filhal aapne kaha tha hamesha true dikhana hai
  const isAuth = true; 

  return (
    <Routes>
      {/* 1. Wrapper for pages with Navbar/Footer */}
      <Route element={<MainLayout isAuthenticated={true} />}>
        
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />

        {/* 2. Protected Routes (Inside the same MainLayout) */}
        <Route element={<ProtectedRoute isAuthenticated={true} />}>
          <Route path="/ai-assistant" element={<AiAssistant />} /> 
           <Route path="/patient/find-doctor" element={<FindDoctor/>} /> 

              <Route path="/patient/dashboard" element={<PatientDashboard/>} /> 
                  <Route path="/patient/edit-profile" element={<EditProfile/>} /> 
          {/* Baaki patient/doctor routes yahan aayenge */}


   <Route path="/patient/profile-setup" element={<PatientProfileSetup/>} />




        </Route>

      </Route>

      {/* 3. Auth Routes (Without Navbar/Footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;