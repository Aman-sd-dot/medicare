import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  prescriptions: [],
  loading: false,
  uploading: false,
  error: null,
  success: false
};

export const uploadPrescriptionFile = createAsyncThunk(
  'prescriptions/upload',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/prescriptions/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Note: Content-Type is set automatically by the browser for FormData (multipart/form-data)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.prescription;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyPrescriptions = createAsyncThunk(
  'prescriptions/fetchMy',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/prescriptions/my-prescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.prescriptions;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Admin Thunks
export const fetchAllPrescriptionsAdmin = createAsyncThunk(
  'prescriptions/adminFetchAll',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/prescriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.prescriptions;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const verifyPrescriptionAdmin = createAsyncThunk(
  'prescriptions/adminVerify',
  async ({ id, statusData, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`/api/prescriptions/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(statusData)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      dispatch(fetchAllPrescriptionsAdmin(token));
      return data.prescription;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    resetPrescriptionStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadPrescriptionFile.pending, (state) => {
        state.uploading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadPrescriptionFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.success = true;
        state.prescriptions.push(action.payload);
      })
      .addCase(uploadPrescriptionFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // Fetch My Prescriptions
      .addCase(fetchMyPrescriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchMyPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Prescriptions Admin
      .addCase(fetchAllPrescriptionsAdmin.fulfilled, (state, action) => {
        state.prescriptions = action.payload;
      });
  }
});

export const { resetPrescriptionStatus } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;
