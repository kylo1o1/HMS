import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    ordersData: {
        list: [],
        deliveredCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
        confirmedCount: 0,
    },
    error: null,
};

const adminOrdersSlice = createSlice({
    name: "adminOrders",
    initialState,
    reducers: {
        startFetchingOrders: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        ordersFetchSuccess: (state, action) => {
            state.isLoading = false;
            state.ordersData = {
                list: action.payload.data || [],
                deliveredCount: action.payload.deliveredCount || 0,
                pendingCount: action.payload.pendingCount || 0,
                cancelledCount: action.payload.cancelledCount || 0,
                confirmedCount: action.payload.confirmedCount || 0,
            };
            state.error = null;
        },
        ordersFetchFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        setOrderStatus: (state, action) => {
            if (!state.ordersData.list) state.ordersData.list = []; // Ensure array exists
        
            const orderIndex = state.ordersData.list.findIndex(order => order._id === action.payload.orderId);
            console.log(orderIndex);
            console.log(action.payload);
            
            
            if (orderIndex !== -1) {
                state.ordersData.list[orderIndex] = {
                    ...state.ordersData.list[orderIndex],
                    status: action.payload.newStatus,
                };
            }
            console.log(state.ordersData.list[orderIndex]);
            
        }
        
    },
});

export const { 
    startFetchingOrders, 
    ordersFetchSuccess, 
    ordersFetchFailure, 
    setOrderStatus 
} = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;
