import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import AdminLayout from './features/admin/AdminLayout.jsx';  // 👈 ADD THIS

// Public Pages
import HomePage from './features/home/pages/HomePage.jsx';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AiUploadReport from './features/ai-assistant/pages/AiUploadReport.jsx';
import AIResultPage from './features/ai-assistant/pages/AiResultReport.jsx';
import Services from './features/services/pages/Services';
import FindDoctor from './features/patient/pages/FindDoctor';

// Patient Pages
import PatientDashboard from './features/patient/pages/PatientDashboard';
import EditProfile from './features/patient/pages/EditProfile';
import PatientProfileSetup from './features/patient/pages/PatientProfileSetup';

// Doctor Pages
import DoctorDashboard from './features/doctor/pages/DoctorDashboard';

// 👈 ADD ADMIN PAGES
import AdminOverview from './features/admin/pages/Overview';
import AdminDoctors from './features/admin/pages/Doctors';
import AdminRequests from './features/admin/pages/Requests';

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// 👈 ADD ADMIN PROTECTED ROUTE (optional - agar admin login chahiye)
const AdminProtectedRoute = ({ isAuthenticated }) => {
  // Temporary - hardcoded true for testing
  // Baad mein real auth check karna
  const isAdmin = true; // localStorage.getItem("admin_role") === "admin"
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppRoutes = () => {
  const isAuth = true;

  return (
    <Routes>

      {/* ==================== ADMIN ROUTES ==================== */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
        </Route>
      </Route>

      {/* ==================== PATIENT & DOCTOR DASHBOARDS ==================== */}
      <Route element={<ProtectedRoute isAuthenticated={isAuth} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Route>

      {/* ==================== PUBLIC ROUTES (with Navbar/Footer) ==================== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/find-doctor" element={<FindDoctor />} />
        <Route path="/ai-upload-report" element={<AiUploadReport />} />
        <Route path="/ai-result-upload" element={<AIResultPage />} />
        <Route path="/patient/profile-setup" element={<PatientProfileSetup />} />
        <Route path="/patient/edit-profile" element={<EditProfile />} />
      </Route>

      {/* ==================== AUTH ROUTES (without Navbar/Footer) ==================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;