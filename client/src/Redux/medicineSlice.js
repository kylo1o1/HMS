import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    medicines:[],
    loading:false,
    error:""
}

const medicineSlice = createSlice({
    name:"medicineSlice",
    initialState,
    reducers:{
        fetchMedStart:(state,action)=>{
            state.loading = true;
            state.error = null;
        },
        fetchMedSuccess:(state,action)=>{
            state.loading = false;
            state.medicines = action.payload;
            state.error= null;
        },
        fetchMedFail :(state,actions)=>{
            state.loading = false;
            state.error = actions.payload.error
        }
    }
})

export const {fetchMedFail,fetchMedStart,fetchMedSuccess} = medicineSlice.actions
export default medicineSlice.reducer ;
