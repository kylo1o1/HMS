import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import dataSlice from "./dataSlice.js"

const store = configureStore({
    reducer:{
        auth:authSlice,
        dataSL : dataSlice
    }
})

export default store;
