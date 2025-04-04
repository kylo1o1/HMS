import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetching: false,
  appointments: [],
  error: null,
};

const patientAppointmentsSlice = createSlice({
  name: "patientAppointments",
  initialState,
  reducers: {
    fetchPatientAppointmentsStart: (state) => {
      state.fetching = true;
      state.error = null;
    },
    fetchPatientAppointmentsSuccess: (state, action) => {
      state.fetching = false;
      state.appointments = action.payload;
    },
    fetchPatientAppointmentsFailure: (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    },
    addPatientAppointment: (state, action) => {
      state.appointments.push(action.payload); 
    },
    cancelPatientAppointmentSuccess: (state, action) => {
      state.appointments = state.appointments.map((appointment) =>
        appointment._id === action.payload ? { ...appointment, status: "Cancelled" } : appointment
      );
    },
    cancelPatientAppointmentFailure: (state, action) => {
      state.error = action.payload;
    },
    updateAppnmtPaymentStatus : (state,action)=>{
      state.appointments = state.appointments.map((appointment)=>
        appointment._id === action.payload ? {...appointment,paymentStatus:"Completed"} : appointment
      );
    },

    resetPatientAppointmentState: () => initialState,
  },
});

export const {
  fetchPatientAppointmentsStart,
  fetchPatientAppointmentsSuccess,
  fetchPatientAppointmentsFailure,
  addPatientAppointment,  
  cancelPatientAppointmentSuccess,
  cancelPatientAppointmentFailure,
  updateAppnmtPaymentStatus,
  resetPatientAppointmentState,

} = patientAppointmentsSlice.actions;

export default patientAppointmentsSlice.reducer;
