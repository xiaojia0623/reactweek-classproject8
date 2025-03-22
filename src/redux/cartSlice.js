import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    carts: [],
    total: 0,
    final_total: 0,
    qty:0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCartData(state, action){
            const { carts, total, final_total,} = action.payload;
            const qty = carts.reduce(function(accu, cart) {
                return accu + cart.qty;
            }, 0);


            state.carts = carts;
            state.total = total;
            state.final_total = final_total;
            state.qty = qty
        },
        clearCartData(state) {
            state.carts = [],
            state.total = 0,
            state.final_total = 0;
            state.qty = 0
        }
    }
})

export const { updateCartData, clearCartData } = cartSlice.actions;
export default cartSlice.reducer;