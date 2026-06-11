import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import medicineReducer from './medicineSlice.js';
import cartReducer from './cartSlice.js';
import orderReducer from './orderSlice.js';
import prescriptionReducer from './prescriptionSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medicines: medicineReducer,
    cart: cartReducer,
    orders: orderReducer,
    prescriptions: prescriptionReducer
  }
});

export default store;
