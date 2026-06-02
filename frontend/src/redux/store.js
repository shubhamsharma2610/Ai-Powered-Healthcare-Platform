import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import doctorReducer from './slices/doctorSlice.js';
import appointmentReducer from './slices/appointmentSlice.js';
import patientReducer from './slices/patientSlice.js';  
import transactionReducer from './slices/transactionSlice.js';  // ✅ Import transaction reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
      patient: patientReducer,
    transactions: transactionReducer,  // ✅ Add transaction reducer  
  },
});