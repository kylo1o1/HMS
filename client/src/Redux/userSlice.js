import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    user :[],
    isAuth:false,
}

const userSlice = createSlice({
    name:"userSlice",
    initialState,
    reducers:{
        getUserDeets:(state,actions)=>{
            state.user = actions.payload.user
        }
    }
})

export default userSlice.reducer
export const {getUserDeets} = userSlice.actions