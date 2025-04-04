import { createSlice } from "@reduxjs/toolkit";


const initialState =  {
    loading: false,
    doctors: [],
    noOfDoctor:null,
    error: "",
  }
const dataSlice = createSlice({
    name: "doctors",
    initialState,
    reducers: {
      fetchDocStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      fetchDocSuccess: (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.noOfDoctor = action.payload.noOfDoctors
      },
      fetchDocFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      addDoc: (state, action) => {
        state.doctors = [action.payload, ...state.doctors];
      },
      resetDoctorListState: () => initialState, // Reset on logout
    },
  });
  
  export const { fetchDocStart, fetchDocSuccess, fetchDocFail, addDoc, resetDoctorListState } =
    dataSlice.actions;
  export default dataSlice.reducer;
  