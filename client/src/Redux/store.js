import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import dataSlice from "./dataSlice.js"
import medicineSlice from "./medicineSlice.js"
import cartSlice from "./cartSlice.js" 
import doctorSlice from "./doctorSlice.js"
import scheduleSlice from "./schedule.js"
import patientAppointment from "./patientAppointments.js"
import orderSlice from './ordersSlice.js'
import doctorAppointmentSlice from "./doctorAppoinments.js"
import adminOrdersSlice from './allOrders.js'
import adminAppointmentSlice from "./adminAppoinments.js"
import patientSlice from "./patientsSlice.js"
import revenueSlice from "./revenueSlice.js"

const combinedReducer = combineReducers({
    auth:authSlice,
    dataSL : dataSlice,
    medicineSl: medicineSlice,
    cartSl:cartSlice,
    doctorData:doctorSlice,
    scheduleData:scheduleSlice,
    patientAppointmentData:patientAppointment,
    ordersData:orderSlice,
    doctorAppointmentData:doctorAppointmentSlice,
    adminOrderData:adminOrdersSlice,
    adminAppointmentData:adminAppointmentSlice,
    patientData : patientSlice,
    revenueData : revenueSlice
})

const rootReducer =(state,action)=>{
    if(action.type === "auth/logout"){
        state = undefined;
        
    }
    return combinedReducer(state,action)
}

const store = configureStore({
    reducer:rootReducer,
})

export default store;
