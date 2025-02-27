import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  cart: {
    userId: null,
    medicines: [],
    totalPrice: 0,
  },
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Start fetching/updating cart
    cartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    // Successfully fetched/updated cart
    cartSuccess(state, action) {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;
    },
    // Failed to update/fetch cart
    cartFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addItemToCart(state, action) {
      
      state.cart.medicines.unshift(action.payload);

    },
    removeItemFromCart(state, action) {
      state.cart.medicines = state.cart.medicines.filter(
        (item) => item.medicineId._id !== action.payload.medicineId
      );
      state.cart.totalPrice = state.cart.medicines.reduce((sum, item) => sum + item.itemTotal, 0);
    },
    updateItemQuantity: (state, action) => {
      const { medicineId, quantity, amount } = action.payload;
      console.log(action.payload);
      
      const itemIndex = state.cart.medicines.findIndex(item => item.medicineId._id === medicineId);

        if (itemIndex !== -1) {
          if (quantity <= 0) {
            // Remove the item from the cart if quantity is 0
            state.cart.medicines.splice(itemIndex, 1);
          } else {
            // Update quantity and itemTotal
            state.cart.medicines[itemIndex].quantity = quantity;
            state.cart.medicines[itemIndex].itemTotal = quantity * amount;
          }
        }
      state.cart.totalPrice = state.cart.medicines.reduce((sum, item) => sum + item.itemTotal, 0);  
    },
    
    clearCart(state) {
      state.cart = { userId: state.cart.userId, medicines: [], totalPrice: 0 };
    },
  },
});

export const {
  cartRequest,
  cartSuccess,
  cartFail,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
