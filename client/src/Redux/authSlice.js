import { createSlice } from '@reduxjs/toolkit';
import { resetCartState } from './cartSlice';
import { resetDoctorListState } from './dataSlice';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        isAuthenticated: !!localStorage.getItem("user"),
        loading: false,
        error: null
    },    
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            sessionStorage.setItem("token", action.payload.token);
            state.loading = false;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
