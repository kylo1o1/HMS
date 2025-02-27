import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    scheduleLoading: false,
    schedule: [
        
    ],
    scheduleError: null,
    updateLoading: false,
    updateSuccess: false,
    updateError: null
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

        // ✅ Updating Schedule
        setUpdateLoading: (state) => {
            state.updateLoading = true;
            state.updateSuccess = false;
            state.updateError = null;
        },
        updateScheduleSuccess: (state, action) => {
            state.schedule = action.payload;
            state.updateLoading = false;
            state.updateSuccess = true;
            state.updateError = null;
        },
        updateScheduleFailure: (state, action) => {
            state.updateLoading = false;
            state.updateSuccess = false;
            state.updateError = action.payload;
        },
    }
});

export const { 
    setScheduleLoading, 
    fetchScheduleSuccess, 
    fetchScheduleFailure, 
    setUpdateLoading, 
    updateScheduleSuccess, 
    updateScheduleFailure 
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
