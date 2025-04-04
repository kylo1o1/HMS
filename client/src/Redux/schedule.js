import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  scheduleLoading: false,
  schedule: [],
  scheduleError: null,
  updateLoading: false,
  updateSuccess: false,
  updateError: null,
};
const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
      setScheduleLoading: (state) => {
        state.scheduleLoading = true;
        state.scheduleError = null;
      },
      fetchScheduleSuccess: (state, action) => {
        state.schedule = action.payload;
        state.scheduleLoading = false;
        state.scheduleError = null;
      },
      fetchScheduleFailure: (state, action) => {
        state.scheduleLoading = false;
        state.scheduleError = action.payload;
      },
      setUpdateLoading: (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.updateError = null;
      },
      updateScheduleSuccess: (state, action) => {
        state.schedule = action.payload;
        state.updateLoading = false;
        state.updateSuccess = true;
      },
      updateScheduleFailure: (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      },
      resetScheduleState: () => initialState, // Reset on logout
    },
  });
  
  export const {
    setScheduleLoading,
    fetchScheduleSuccess,
    fetchScheduleFailure,
    setUpdateLoading,
    updateScheduleSuccess,
    updateScheduleFailure,
    resetScheduleState,
  } = scheduleSlice.actions;
  
  export default scheduleSlice.reducer;
  