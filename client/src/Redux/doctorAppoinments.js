import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fetching: false, 
    updating: false,  
    appointments: [],
    stats: {
      numberOfPatients: 0,
      numberOfAppointments: 0,
      numberOfCompletedAppointments: 0,
      numberOfCancelledAppointments: 0,
    },
    error: null,
  };
  
  const doctorAppointmentSlice = createSlice({
    name: "doctorAppointment",
    initialState,
    reducers: {
      fetchAppointmentsStart: (state) => {
        state.fetching = true;
        state.error = null;
      },
      fetchAppointmentsSuccess: (state, action) => {
        state.fetching = false;
        state.appointments = action.payload.appointments;
        state.stats = {
          numberOfPatients: action.payload.numberOfPatients,
          numberOfAppointments: action.payload.numberOfAppointments,
          numberOfCompletedAppointments: action.payload.numberOfCompletedAppointments,
          numberOfCancelledAppointments: action.payload.numberOfCancelledAppointments,
        };
      },
      fetchAppointmentsFailure: (state, action) => {
        state.fetching = false;
        state.error = action.payload;
      },
      updateAppointmentStart: (state) => {
        state.updating = true;
      },
      updateAppointmentSuccess: (state, action) => {
        state.updating = false;
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload ? (appointment.status = "Completed",state.stats.numberOfCompletedAppointments +=1) : appointment
        );
      },
      updateAppointmentFailure: (state, action) => {
        state.updating = false;
        state.error = action.payload;
      },
      cancelAppointmentSuccess: (state, action) => {
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload ? { ...appointment, status: "Cancelled" } : appointment
        );
        state.stats.numberOfCancelledAppointments += 1;
      },
      completeAppointmentSuccess: (state, action) => {
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload ? { ...appointment, status: "Completed" } : appointment
        );
        state.stats.numberOfCompletedAppointments += 1;
      },
      resetAppointmentState: () => initialState, // Reset on logout
    },
  });
  
  export const {
    fetchAppointmentsStart,
    fetchAppointmentsSuccess,
    fetchAppointmentsFailure,
    updateAppointmentStart,
    updateAppointmentSuccess,
    updateAppointmentFailure,
    cancelAppointmentSuccess,
    completeAppointmentSuccess,
    resetAppointmentState,
  } = doctorAppointmentSlice.actions;
  
  export default doctorAppointmentSlice.reducer;
  