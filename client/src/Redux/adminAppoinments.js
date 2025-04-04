import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appLoading: false,
  appData: {
    appointments: [],
    completedApps: null,
  },
  error: "",
};

const adminAppointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    appLoading: (state) => {
      state.appLoading = true;
      state.error = null;
    },
    appFetchSuccess: (state, action) => {
      state.appData.appointments = action.payload.appointments;
      state.appLoading = false;
      state.appData.completedApps = action.payload.completed;
    },
    appFetchFailure: (state, action) => {
      state.appLoading = false;
      state.error = action.payload;
    },
    appUpdateStatusSuccess: (state, action) => {
      const { id, status } = action.payload;
      const index = state.appData.appointments.findIndex(app => app._id === id);
      if (index !== -1) {
        state.appData.appointments[index].status = status;
      }
      state.appLoading = false;
    },
  },
});

export const { 
  appLoading, 
  appFetchSuccess, 
  appFetchFailure, 
  appUpdateStatusSuccess 
} = adminAppointmentSlice.actions;

export default adminAppointmentSlice.reducer;
