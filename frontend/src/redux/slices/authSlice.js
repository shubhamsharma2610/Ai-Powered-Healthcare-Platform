import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../../features/auth/services/authApi.js';
import Cookies from 'js-cookie';

// ============ ASYNC THUNKS ============

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      
      // ✅ NO localStorage - Backend sets HTTP-only cookie automatically
      // Just return response, cookie is handled by backend
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      
      // ✅ NO localStorage - Backend sets cookie on register
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutAPI = createAsyncThunk(
  'auth/logoutAPI',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ============ HELPER FUNCTIONS ============

// Check if cookie exists (HTTP-only cookie can't be read, but we can track via user data)
const getInitialAuthState = () => {
  // For HTTP-only cookies, we can't read token directly
  // So we check if we have user data or rely on backend
  const userStr = localStorage.getItem('user'); // Only store user data, NOT token
  const user = userStr ? JSON.parse(userStr) : null;
  const normalizedUser = user
    ? { ...user, role: user.role?.toLowerCase?.() || user.role }
    : null;
  
  return {
    user: normalizedUser,
    isAuthenticated: !!normalizedUser,  // If we have user data, assume authenticated
    role: normalizedUser?.role || null,
    isLoading: false,
    error: null,
  };
};

// ============ INITIAL STATE ============

const initialState = getInitialAuthState();

// ============ SLICE ============

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      // Clear user data from localStorage (only user info, not token)
      localStorage.removeItem('user');
      // Cookies will be cleared by backend, but also try to clear
      Cookies.remove('token');
      Cookies.remove('myToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      const normalizedUser = action.payload
        ? { ...action.payload, role: action.payload.role?.toLowerCase?.() || action.payload.role }
        : null;
      state.user = normalizedUser;
      state.isAuthenticated = !!normalizedUser;
      state.role = normalizedUser?.role || null;
      if (normalizedUser) {
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== LOGIN ==========
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        const normalizedUser = {
          ...action.payload.user,
          role: action.payload.user?.role?.toLowerCase?.() || action.payload.user?.role,
        };
        state.user = normalizedUser;
        state.role = normalizedUser.role;
        // Store only user data, NOT token (token is in HTTP-only cookie)
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
      })
      
      // ========== REGISTER ==========
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        const normalizedUser = {
          ...action.payload.user,
          role: action.payload.user?.role?.toLowerCase?.() || action.payload.user?.role,
        };
        state.user = normalizedUser;
        state.role = normalizedUser.role;
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('user');
      })
      
      // ========== FETCH CURRENT USER ==========
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        const normalizedUser = {
          ...action.payload.user,
          role: action.payload.user?.role?.toLowerCase?.() || action.payload.user?.role,
        };
        state.user = normalizedUser;
        state.role = normalizedUser.role;
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        localStorage.removeItem('user');
        Cookies.remove('token');
        Cookies.remove('myToken');
      })
      
      // ========== LOGOUT API ==========
      .addCase(logoutAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAPI.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        localStorage.removeItem('user');
        Cookies.remove('token');
        Cookies.remove('myToken');
      })
      .addCase(logoutAPI.rejected, (state) => {
        state.isLoading = false;
        // Still logout locally even if API fails
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        localStorage.removeItem('user');
        Cookies.remove('token');
        Cookies.remove('myToken');
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;