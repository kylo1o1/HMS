import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  summary: null,
  transactions: [],
  error: "",
};

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    fetchRevenueStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRevenueSuccess: (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    },
    fetchRevenueFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.loading = false;
      state.transactions = action.payload;
    },
    fetchTransactionsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetRevenueState: () => initialState, // Reset on logout
  },
});

export const { 
  fetchRevenueStart, 
  fetchRevenueSuccess, 
  fetchRevenueFail,
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFail,
  resetRevenueState
} = revenueSlice.actions;
export default revenueSlice.reducer;
