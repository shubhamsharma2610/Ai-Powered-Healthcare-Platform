import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import AdminLayout from './features/admin/AdminLayout.jsx';
import { useSelector } from 'react-redux';
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
import DoctorAppointments from './features/doctor/components/DoctorAppointmentsSection';
import DoctorPatients from './features/doctor/components/DoctorPatientsSection';
import DoctorSchedule from './features/doctor/components/DoctorScheduleSection';
import DoctorProfileSection from './features/doctor/components/DoctorProfileSection';
// Admin Pages
import AdminOverview from './features/admin/pages/Overview';
import AdminDoctors from './features/admin/pages/Doctors';
import AdminRequests from './features/admin/pages/Requests';
import AdminPatients from './features/admin/pages/AdminPatients';  


const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userRole = user?.role?.toLowerCase?.();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard
    if (userRole === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    }
    if (userRole === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userRole = user?.role?.toLowerCase?.();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== 'admin') {
    if (userRole === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    }
    if (userRole === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userRole = user?.role?.toLowerCase?.();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (userRole === 'patient') {
    return <Navigate to="/patient/dashboard" replace />;
  }
  if (userRole === 'doctor') {
    return <Navigate to="/doctor/dashboard" replace />;
  }
  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== ADMIN ROUTES ==================== */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="requests" element={<AdminRequests />} />
      </Route>

      {/* ==================== PATIENT ROUTES ==================== */}
      <Route 
        path="/patient" 
        element={
          <RoleBasedRoute allowedRoles={['patient']}>
            <Outlet />
          </RoleBasedRoute>
        }
      >
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="profile-setup" element={<PatientProfileSetup />} />
        {/* Add these routes when files are created */}
        {/* <Route path="appointments" element={<PatientAppointments />} /> */}
        {/* <Route path="profile" element={<PatientProfile />} /> */}
      </Route>

      {/* ==================== DOCTOR ROUTES ==================== */}
      <Route 
        path="/doctor" 
        element={
          <RoleBasedRoute allowedRoles={['doctor']}>
            <Outlet />
          </RoleBasedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="profile" element={<DoctorProfileSection />} />
      </Route>

      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/find-doctors" element={<FindDoctorsPage />} />
        <Route path="/doctor/:id" element={<DoctorProfilePage />} />
        <Route path="/doctor/:id/book" element={<BookingPage />} />
        <Route path="/ai-upload-report" element={<AiUploadReport />} />
        <Route path="/ai-result-upload" element={<AIResultPage />} />
      </Route>

      {/* ==================== AUTH ROUTES ==================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Route>

      {/* ==================== REDIRECTS ==================== */}
      <Route path="/redirect" element={<RoleBasedRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;