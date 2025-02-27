import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    loading:false,
    doctors:[],
    error:"",
}

const dataSlice = createSlice({
    name:"dataSlice",
    initialState,
    reducers:{
        fetchDocStart:(state,action)=>{
            state.loading = true;
            state.error = null;
        },
        fetchDocSuccess:(state,action)=>{
            state.loading = false;
            state.doctors = action.payload.doctors;
            state.error = null
        },
        fetchDocFail :(state,action)=>{
            state.loading = false;
            state.error = action.payload.error;
        },
        addDoc:(state,action)=>{
            state.doctors = [action.payload,...state.doctors]
        },
       
    }
})

export const {fetchDocFail,fetchDocStart,fetchDocSuccess,addDoc} = dataSlice.actions
export default dataSlice.reducer