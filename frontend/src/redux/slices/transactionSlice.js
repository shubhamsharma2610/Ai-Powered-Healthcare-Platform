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
      console.log('Transactions API Response:', response.data); // Debug log
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
        
        // ✅ Map backend response to frontend format
        state.transactions = data.data?.transactions?.map(tx => ({
          id: tx._id,
          doctor: tx.doctorId?.fullName || 'Doctor',
          specialty: tx.doctorId?.specialization || 'General',
          date: new Date(tx.createdAt).toLocaleDateString('en-IN'),
          amount: tx.amount,
          status: tx.status,
        })) || [];
        
        state.summary = {
          totalPaid: data.data?.summary?.totalSpent || 0,
          pending: 0,  // Backend se pending amount nahi aa raha
          refunded: 0, // Backend se refunded amount nahi aa raha
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;