import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  cart: {
    medicines: [],
    totalPrice: 0,
    subtotal: 0,
    discount: 0,
    grandTotal: 0,
  },
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    cartSuccess(state, action) {
      state.loading = false;
      console.log(action.payload);
      
      state.cart = {
        ...action.payload,
        ...calculateTotals(action.payload.medicines),
      };
      state.error = null;
    },
    cartFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addItemToCart(state, action) {
      state.cart.medicines.unshift(action.payload);
      Object.assign(state.cart, calculateTotals(state.cart.medicines));
    },
    updateItemQuantity(state, action) {
      const { medicineId, quantity } = action.payload;
      const item = state.cart.medicines.find(
        (item) => item.medicineId._id === medicineId
      );

      if (item) {
        item.quantity = quantity;
        item.itemTotal = item.amount * quantity;
      }

      Object.assign(state.cart, calculateTotals(state.cart.medicines));
    },
    removeItemFromCart(state, action) {
      state.cart.medicines = state.cart.medicines.filter(
        (item) => item.medicineId._id !== action.payload.medicineId
      );
      Object.assign(state.cart, calculateTotals(state.cart.medicines));
    },
    clearCart(state) {
      state.cart.medicines = [];
      state.cart.subtotal = 0;
      state.cart.discount = 0;
      state.cart.grandTotal = 0;
    },
  },
});

function calculateTotals(medicines) {
  const subtotal = medicines.reduce(
    (sum, item) => sum + item.itemTotal,
    0
  );
  const discount = subtotal * 0.1; // 10% discount
  const grandTotal = subtotal - discount;

  return { subtotal, discount, grandTotal };
}

export const {
  cartRequest,
  cartSuccess,
  cartFail,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
