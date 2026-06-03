import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllDoctors, getDoctorById, getSpecializations } from '../../features/find-doctors/services/doctorApi';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getAllDoctors(filters);
      console.log('=== Doctors API Response ===', response);
      
      if (response.success && response.data) {
        console.log('✅ Returning payload:', response.data);
        return response.data;
      }
      console.log('❌ Response structure incorrect:', response);
      return { doctors: [], pagination: {} };
    } catch (error) {
      console.error('❌ Fetch error:', error.message);
      return rejectWithValue(error.message || 'Failed to fetch doctors');
    }
  }
);

// ✅ UPDATED: fetchDoctorById - No breaking changes, only uses getDoctorById
export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const doctorData = await getDoctorById(id);
      console.log('Doctor data in thunk:', doctorData);
      return doctorData;
    } catch (error) {
      console.error('❌ Fetch doctor by ID error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor details');
    }
  }
);

export const fetchSpecializations = createAsyncThunk(
  'doctors/fetchSpecializations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSpecializations();
      console.log('Specializations API Response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  doctors: [],
  selectedDoctor: null,
  specializations: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  }
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        console.log('📦 Redux Payload:', action.payload);
        console.log('📦 Doctors extracted:', action.payload?.doctors);
        state.doctors = action.payload?.doctors || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
        console.log('📦 State updated:', { doctors: state.doctors.length, pagination: state.pagination });
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Redux Error:', action.payload);
      })
      
      // Fetch Doctor By ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
        console.log('✅ Doctor loaded:', state.selectedDoctor?.fullName);
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Fetch doctor error:', action.payload);
      })
      
      // Fetch Specializations
      .addCase(fetchSpecializations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.loading = false;
        state.specializations = action.payload || [];
      })
      .addCase(fetchSpecializations.rejected, (state) => {
        state.loading = false;
        state.specializations = [];
      });
  }
});

export const { clearSelectedDoctor, clearError } = doctorSlice.actions;
export default doctorSlice.reducer;