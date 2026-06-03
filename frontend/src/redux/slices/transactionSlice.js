import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/patients/transactions`, {
        withCredentials: true
      });
      console.log('Transactions API Response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  transactions: [],
  summary: { totalPaid: 0, pending: 0, refunded: 0 },
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        
        // ✅ Get all transactions from backend
        const allTransactions = data.data?.transactions || [];
        
        // ✅ Filter out transactions where appointment is cancelled
        const activeTransactions = allTransactions.filter(tx => {
          // Check if appointment exists and is not cancelled
          const appointment = tx.appointmentId;
          if (!appointment) return true; // Keep if no appointment reference
          // ✅ Remove transactions for cancelled appointments
          return appointment.status !== 'cancelled';
        });
        
        // ✅ Map to frontend format
        state.transactions = activeTransactions.map(tx => ({
          id: tx._id,
          doctor: tx.doctorId?.fullName || 'Doctor',
          specialty: tx.doctorId?.specialization || 'General',
          date: new Date(tx.createdAt).toLocaleDateString('en-IN'),
          amount: tx.amount,
          status: tx.status,
          appointmentStatus: tx.appointmentId?.status
        }));
        
        // ✅ Calculate summary from active transactions only
        const successfulTx = activeTransactions.filter(tx => tx.status === 'success');
        const pendingTx = activeTransactions.filter(tx => tx.status === 'created' || tx.status === 'pending');
        const refundedTx = activeTransactions.filter(tx => tx.status === 'refunded');
        
        state.summary = {
          totalPaid: successfulTx.reduce((sum, tx) => sum + tx.amount, 0),
          pending: pendingTx.reduce((sum, tx) => sum + tx.amount, 0),
          refunded: refundedTx.reduce((sum, tx) => sum + tx.amount, 0)
        };
        
        console.log('Active transactions:', state.transactions.length);
        console.log('Summary:', state.summary);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;