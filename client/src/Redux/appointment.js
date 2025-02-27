import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading:false,
    appointments:[],
    error:null
}

const appointmentSlice = createSlice({
    name:"appointmentSlice",
    initialState,
    reducers:{
        fetchAppointmentsStart: (state) => {
            state.loading = true;
            state.error = null;
          },
          fetchAppointmentsSuccess: (state, action) => {
            state.loading = false;
            state.appointments = action.payload;
          },
          fetchAppointmentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          updateAppointmentStart: (state) => {
            state.loading = true;
          },
          updateAppointmentSuccess: (state, action) => {
            state.loading = false;
            const updatedAppointment = action.payload;
            state.appointments = state.appointments.map((appointment) =>
              appointment._id === updatedAppointment._id
                ? updatedAppointment
                : appointment
            );
          },
          updateAppointmentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
           
          cancelAppointmentSuccess: (state, action) => {
            state.loading = false;
            state.appointments = state.appointments.map((appointment) =>
              appointment._id === action.payload ? { ...appointment, status: "Cancelled" } : appointment
            );
          },          
          completeAppointmentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          
        },
      });
      
export const {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  updateAppointmentStart,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  cancelAppointmentStart,
  cancelAppointmentSuccess,
  cancelAppointmentFailure,
  completeAppointmentStart,
  completeAppointmentSuccess,
  completeAppointmentFailure,
} = appointmentSlice.actions;
      
export default appointmentSlice.reducer;