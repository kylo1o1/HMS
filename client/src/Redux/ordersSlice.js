import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  orders: [],
  loadingFetch: false,
  loadingUpdate: false,
  error: null,
  
}
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.loadingFetch = true;
      state.error = null;
    },
    fetchOrdersSuccess(state, action) {
      state.loadingFetch = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure(state, action) {
      state.loadingFetch = false;
      state.error = action.payload;
    },
    updateOrderList(state, action) {
      const newOrder = action.payload;
      const existingIndex = state.orders.findIndex(order => order._id === newOrder._id);
      if (existingIndex !== -1) {
        state.orders[existingIndex] = newOrder;
      } else {
        state.orders.push(newOrder);
      }
    },
    updateOrderStatusStart(state) {
      state.loadingUpdate = true;
    },
    updateOrderStatusSuccess(state, action) {
      state.loadingUpdate = false;
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    updateOrderStatusFailure(state, action) {
      state.loadingUpdate = false;
      state.error = action.payload;
    },
    resetOrderState: () => initialState, // Reset on logout
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderList,
  updateOrderStatusStart,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
