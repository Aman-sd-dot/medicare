import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart } from './cartSlice.js';

const initialState = {
  orders: [],
  currentOrder: null,
  analytics: null,
  loading: false,
  analyticsLoading: false,
  error: null
};

export const placeOrder = createAsyncThunk(
  'orders/place',
  async ({ orderData, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      dispatch(clearCart());
      return data.order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Admin Thunks
export const fetchAllOrdersAdmin = createAsyncThunk(
  'orders/adminFetchAll',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOrderStatusAdmin = createAsyncThunk(
  'orders/adminUpdateStatus',
  async ({ id, statusData, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(statusData)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      dispatch(fetchAllOrdersAdmin(token));
      return data.order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminAnalytics = createAsyncThunk(
  'orders/adminAnalytics',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data; // returns { stats, categorySales, recentOrders }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // Admin Fetch All Orders
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      // Fetch Admin Analytics
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state) => {
        state.analyticsLoading = false;
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
