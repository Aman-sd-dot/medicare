import { createSlice } from '@reduxjs/toolkit';

let storedCartItems = [];
try {
  const cartStr = localStorage.getItem('cartItems');
  storedCartItems = cartStr ? JSON.parse(cartStr) : [];
} catch (err) {
  localStorage.removeItem('cartItems');
}

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharges = subtotal > 500 || items.length === 0 ? 0 : 40;
  const tax = Math.round(subtotal * 0.12 * 100) / 100; // 12% GST
  const total = subtotal + deliveryCharges + tax;
  const needsPrescription = items.some(item => item.requiresPrescription);

  return { subtotal, deliveryCharges, tax, total, needsPrescription };
};

const defaultTotals = calculateTotals(storedCartItems);

const initialState = {
  items: storedCartItems,
  ...defaultTotals
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { medicineId, name, price, requiresPrescription, imageUrl, stock } = action.payload;
      const existingItem = state.items.find(item => item.medicineId === medicineId);

      if (existingItem) {
        if (existingItem.quantity < stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({
          medicineId,
          name,
          price,
          requiresPrescription,
          imageUrl,
          stock,
          quantity: 1
        });
      }

      // Re-calculate totals
      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const medicineId = action.payload;
      state.items = state.items.filter(item => item.medicineId !== medicineId);

      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { medicineId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.medicineId === medicineId);

      if (existingItem && quantity >= 1 && quantity <= existingItem.stock) {
        existingItem.quantity = quantity;
      }

      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.deliveryCharges = 0;
      state.tax = 0;
      state.total = 0;
      state.needsPrescription = false;
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
