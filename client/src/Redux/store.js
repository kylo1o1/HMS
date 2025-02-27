import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import dataSlice from "./dataSlice.js"
import medicineSlice from "./medicineSlice.js"
import cartSlice from "./cartSlice.js" 
import doctorSlice from "./doctorSlice.js"
import scheduleSlice from "./schedule.js"
import appointmentSlice from "./appointment.js"
const store = configureStore({
    reducer:{
        auth:authSlice,
        dataSL : dataSlice,
        medicineSl: medicineSlice,
        cartSl:cartSlice,
        doctorData:doctorSlice,
        scheduleData:scheduleSlice,
        appointmentData:appointmentSlice,
    }
})

export default store;
