import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAppointment, getUserAppointments, cancelAppointment } from '../../features/find-doctors/services/bookingApi';

// Async Thunks
export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await createAppointment(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchMyAppointments = createAsyncThunk(
  'appointments/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserAppointments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const cancelUserAppointment = createAsyncThunk(
  'appointments/cancel',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await cancelAppointment(appointmentId);
      return { id: appointmentId, message: response.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  appointments: [],
  currentBooking: null,
  loading: false,
  error: null
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Appointments
      .addCase(fetchMyAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Appointment
      .addCase(cancelUserAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (apt) => apt._id !== action.payload.id
        );
      });
  }
});

export const { clearBooking, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;