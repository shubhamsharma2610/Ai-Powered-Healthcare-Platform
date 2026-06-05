import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import AdminLayout from './features/admin/AdminLayout.jsx';

// Public Pages
import HomePage from './features/home/pages/HomePage.jsx';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AiUploadReport from './features/ai-assistant/pages/AiUploadReport.jsx';
import AIResultPage from './features/ai-assistant/pages/AiResultReport.jsx';
import Services from './features/services/pages/Services';
import AboutUsPage from './features/About-us/pages/AboutUsPage.jsx';

// Patient Pages
import PatientDashboard from './features/patient/pages/PatientDashboard';
import EditProfile from './features/patient/pages/EditProfile';
import PatientProfileSetup from './features/patient/pages/PatientProfileSetup';

// ✅ Fixed: Import FindDoctorsPage from correct location
import FindDoctorsPage from './features/find-doctors/pages/FindDoctorsPage.jsx';
import DoctorProfilePage from './features/find-doctors/pages/DoctorProfilePage.jsx';
import BookingPage from './features/find-doctors/pages/BookingPage.jsx';

// // Patient Pages
// import PatientDashboard from './features/patient/pages/PatientDashboard';
// import EditProfile from './features/patient/pages/EditProfile';
// import PatientProfileSetup from './features/patient/pages/PatientProfileSetup';

// Doctor Pages
import DoctorDashboard from './features/doctor/pages/DoctorDashboard';

// Admin Pages
import AdminOverview from './features/admin/pages/Overview';
import AdminDoctors from './features/admin/pages/Doctors';
import AdminRequests from './features/admin/pages/Requests';
import AdminPatients from './features/admin/pages/AdminPatients';  

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AdminProtectedRoute = ({ isAuthenticated }) => {
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
            <Route path="/admin/patients" element={<AdminPatients />} /> 
          <Route path="/admin/requests" element={<AdminRequests />} />
        </Route>
      </Route>

      {/* ==================== PATIENT & DOCTOR DASHBOARDS ==================== */}
      <Route element={<ProtectedRoute isAuthenticated={isAuth} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        {/* ✅ Add Patient Appointments Route */}
        <Route path="/patient/appointments" element={<div>My Appointments Page</div>} />
      </Route>

      {/* ==================== PUBLIC ROUTES (with Navbar/Footer) ==================== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
         <Route path="/about-us" element={<AboutUsPage />} />
        
        {/* ✅ Fixed: Find Doctors Routes */}
        <Route path="/find-doctors" element={<FindDoctorsPage />} />
        <Route path="/doctor/:id" element={<DoctorProfilePage />} />
        <Route path="/doctor/:id/book" element={<BookingPage />} />
        
        <Route path="/ai-upload-report" element={<AiUploadReport />} />
        <Route path="/ai-result-upload" element={<AIResultPage />} />
        <Route path="/patient/profile-setup" element={<PatientProfileSetup />} />
        <Route path="/patient/edit-profile" element={<EditProfile />} />
      </Route>

      {/* ==================== AUTH ROUTES ==================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;