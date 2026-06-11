import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  medicines: [],
  categories: [],
  currentMedicine: null,
  relatedMedicines: [],
  reviews: [],
  totalCount: 0,
  page: 1,
  pages: 1,
  loading: false,
  categoriesLoading: false,
  detailLoading: false,
  error: null
};

// Async Thunks
export const fetchMedicines = createAsyncThunk(
  'medicines/fetchAll',
  async (queryParams = {}, { rejectWithValue }) => {
    const { search = '', category = '', sort = '', page = 1, limit = 8 } = queryParams;
    const url = `/api/medicines?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=${limit}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'medicines/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.categories;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMedicineDetails = createAsyncThunk(
  'medicines/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/medicines/${id}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data; // returns { medicine, reviews, related }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Admin Thunks
export const createMedicineAdmin = createAsyncThunk(
  'medicines/adminCreate',
  async ({ medicineData, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicineData)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      dispatch(fetchMedicines());
      return data.medicine;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateMedicineAdmin = createAsyncThunk(
  'medicines/adminUpdate',
  async ({ id, medicineData, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicineData)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      dispatch(fetchMedicines());
      return data.medicine;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteMedicineAdmin = createAsyncThunk(
  'medicines/adminDelete',
  async ({ id, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      dispatch(fetchMedicines());
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'medicines/addReview',
  async ({ medicineId, reviewData, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`/api/reviews/${medicineId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      dispatch(fetchMedicineDetails(medicineId));
      return data.review;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    clearCurrentMedicine: (state) => {
      state.currentMedicine = null;
      state.relatedMedicines = [];
      state.reviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Medicines
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload.medicines;
        state.totalCount = action.payload.count;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesLoading = false;
      })
      // Fetch Medicine Details
      .addCase(fetchMedicineDetails.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchMedicineDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentMedicine = action.payload.medicine;
        state.reviews = action.payload.reviews;
        state.relatedMedicines = action.payload.related;
      })
      .addCase(fetchMedicineDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentMedicine } = medicineSlice.actions;
export default medicineSlice.reducer;
