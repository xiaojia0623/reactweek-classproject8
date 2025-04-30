import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderInfo: null,
}

const orderSlice = createSlice({
    name:'order',
    initialState,
    reducers:{
        setOrderInfo(state, action){
            state.orderInfo = action.payload;
        },
        clearOrderInfo(state){
            state.orderInfo = null;
        }
    }
});

export const { setOrderInfo, clearOrderInfo } = orderSlice.actions;
export default orderSlice.reducer;