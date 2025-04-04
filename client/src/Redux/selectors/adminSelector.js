

import { createSelector } from 'reselect';

const selectAdminAppointmentData = (state) => state.adminAppointmentData;
const selectPatientData = (state) => state.patientData;
const selectDoctors = (state) => state?.dataSL;
const selectRevenueData = (state)=> state?.revenueData

export const selectAdminHomeData = createSelector(
  [selectAdminAppointmentData, selectPatientData,selectDoctors,selectRevenueData],
  (adminAppointmentData, patientData,dataSL,revenueData) => ({
    appointmentData :adminAppointmentData.appData?.appointments ?? [],
    completedAppointments: adminAppointmentData?.appData?.completedApps ?? "",
    noOfPatients: patientData?.noOfPatients ?? "",
    patients:patientData?.patients,
    doctors:dataSL?.doctors ??"",
    noOfDoctor:dataSL?.noOfDoctor ?? "",
    summary:revenueData?.summary ?? "",
    transactions:revenueData?.transactions ?? []
  })
);
