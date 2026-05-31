import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getPatientProfile, 
  getPatientAppointments, 
  getTransactionHistory,
  updatePatientProfile as updatePatientProfileAPI  // ✅ Rename import
} from '../../features/patient/services/patientApi';

// Async Thunks
export const fetchPatientProfile = createAsyncThunk(
  'patient/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPatientProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchPatientAppointments = createAsyncThunk(
  'patient/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPatientAppointments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchTransactionHistory = createAsyncThunk(
  'patient/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTransactionHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ✅ Use the renamed import
export const updatePatientProfile = createAsyncThunk(
  'patient/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updatePatientProfileAPI(data);  // ✅ Use renamed function
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  profile: null,
  appointments: [],
  transactions: [],
  summary: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchPatientProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Appointments
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload || [];
      })
      // Fetch Transactions
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.transactions = action.payload?.transactions || [];
        state.summary = action.payload?.summary || null;
      })
      // Update Profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;