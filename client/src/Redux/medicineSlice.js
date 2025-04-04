import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    medicines: [],
    loading: false,
    updateLoading:false,
    error: "",
  }
const medicineSlice = createSlice({
    name: "medicines",
    initialState,
    reducers: {
      fetchMedStart(state) {
        state.loading = true;
        state.error = null;
      },
      fetchMedSuccess(state, action) {
        state.loading = false;
        state.medicines = action.payload;
      },
      fetchMedFail(state, action) {
        state.loading = false;
        state.error = action.payload;
      },
      updateMedicineStart(state,action){
        state.updateLoading = true;
        state.error = null
      },
      updateMedicineSuccess(state,action){
        state.updateLoading = false;
        const index = state.medicines.findIndex((item)=> item._id === action.payload._id);
        if(index){
          state.medicines[index] = action.payload
        }
        state.error = null
      },
      updateMedicineFail(state,action){
        state.updateLoading = false;
        state.error = action.payload
      },
      updateStock(state, action) {
        const { medicineId, quantity, increase } = action.payload;
        const medicine = state.medicines.find(m => m._id === medicineId);
        if (medicine) {
          medicine.stock = increase ? medicine.stock + quantity : medicine.stock - quantity;
        }
      },
      resetMedicineState: () => initialState, // Reset on logout
    },
  });
  
  export const { fetchMedStart, fetchMedSuccess, fetchMedFail, updateStock, resetMedicineState,updateMedicineFail,updateMedicineStart,updateMedicineSuccess } =
    medicineSlice.actions;
  export default medicineSlice.reducer;
  