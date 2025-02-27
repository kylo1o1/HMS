import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctorData: {}, 
  dataLoading: false, 
  error: null, 
};

const doctorSlice = createSlice({
  name: "doctorSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.dataLoading = action.payload;
    },

    fetchDoctorProfileSuccess: (state, action) => {
      state.doctorData = action.payload;
      state.dataLoading = false;
      state.error = null;
    },

    fetchDoctorProfileFailure: (state, action) => {
      state.error = action.payload;
      state.dataLoading = false;
    },

    updateDoctorProfileSuccess: (state, action) => {
      state.doctorData = action.payload;
      state.dataLoading = false;
      state.error = null;
    },

    updateDoctorProfileFailure: (state, action) => {
      state.error = action.payload;
      state.dataLoading = false;
    },
  },
});

// Export actions
export const {
  setLoading,
  fetchDoctorProfileSuccess,
  fetchDoctorProfileFailure,
  updateDoctorProfileSuccess,
  updateDoctorProfileFailure,
} = doctorSlice.actions;

// Export reducer
export default doctorSlice.reducer;