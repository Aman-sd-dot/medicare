import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to load state from localStorage
const storedToken = localStorage.getItem('token');
let storedUser = null;
try {
  const userStr = localStorage.getItem('user');
  storedUser = userStr ? JSON.parse(userStr) : null;
} catch (err) {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

const initialState = {
  token: storedToken,
  user: storedUser,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) return rejectWithValue('No token');
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch profile');
      }
      
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleWishlist: (state, action) => {
      if (state.user) {
        const medicineId = action.payload;
        if (!state.user.wishlist) state.user.wishlist = [];
        const index = state.user.wishlist.indexOf(medicineId);
        if (index > -1) {
          state.user.wishlist.splice(index, 1);
        } else {
          state.user.wishlist.push(medicineId);
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearError, toggleWishlist } = authSlice.actions;
export default authSlice.reducer;
