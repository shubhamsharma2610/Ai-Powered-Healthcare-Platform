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
      console.log('fetchMyAppointments response:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const cancelUserAppointment = createAsyncThunk(
  'appointments/cancel',
  async (appointmentId, { rejectWithValue, dispatch }) => {
    try {
      const response = await cancelAppointment(appointmentId);
      
      // After successful cancellation, refetch appointments to get updated list
      await dispatch(fetchMyAppointments());
      
      // ✅ Return refund information from response
      return { 
        id: appointmentId, 
        message: response.message,
        refundAmount: response.refundAmount || response.data?.refundAmount || 0,
        refundPercentage: response.refundPercentage || response.data?.refundPercentage || 0,
        refundId: response.refundId || response.data?.refundId || null
      };
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
    },
    // ✅ Update appointment status manually (optimistic update)
    updateAppointmentStatus: (state, action) => {
      const { id, status, refundAmount, refundPercentage, refundId } = action.payload;
      const appointment = state.appointments.find(apt => apt._id === id);
      if (appointment) {
        appointment.status = status;
        if (refundAmount !== undefined) appointment.refundAmount = refundAmount;
        if (refundPercentage !== undefined) appointment.refundPercentage = refundPercentage;
        if (refundId !== undefined) appointment.refundId = refundId;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.error = null;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Ensure appointments is always an array
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
        console.log('Appointments updated in Redux:', state.appointments.length);
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.appointments = [];
      })
      
      // Cancel Appointment
      .addCase(cancelUserAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelUserAppointment.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Update the appointment in the list with refund info
        const index = state.appointments.findIndex(apt => apt._id === action.payload.id);
        if (index !== -1) {
          state.appointments[index].status = 'cancelled';
          state.appointments[index].refundAmount = action.payload.refundAmount || 0;
          state.appointments[index].refundPercentage = action.payload.refundPercentage || 0;
          state.appointments[index].refundId = action.payload.refundId || null;
        }
      })
      .addCase(cancelUserAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearBooking, clearError, updateAppointmentStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;