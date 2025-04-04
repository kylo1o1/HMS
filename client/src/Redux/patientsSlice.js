import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  patients: [],
  noOfPatients:null,
  error: "",
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    fetchPatientsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess: (state, action) => {
      state.loading = false;
      state.patients = action.payload.patients;
      state.noOfPatients = action.payload.noOfPatients
    },
    fetchPatientsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;


    },
    addPatient: (state, action) => {
      state.patients = [action.payload, ...state.patients];
    },
    resetPatientListState: () => initialState, // Reset on logout
  },
});

export const { 
  fetchPatientsStart, 
  fetchPatientsSuccess, 
  fetchPatientsFail, 
  addPatient, 
  resetPatientListState 
} = patientSlice.actions;
export default patientSlice.reducer;
