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
        updateCartData(state, action) {
            const { carts = [], coupon = null } = action.payload;
            const { total, final_total, qty } = recalculateTotals(carts, coupon);
      
            state.carts = carts;
            state.total = total;
            state.final_total = final_total;
            state.qty = qty;
          },
      clearCartData(state) {
        state.carts = [];
        state.total = 0;
        state.final_total = 0;
        state.qty = 0;
      },
      updateOrderInfo(state, action) {
        state.orderInfo = action.payload;
      },
      updateItemQty(state, action) {
        const { id, qty } = action.payload;
        const item = state.carts.find(item => item.id === id);
        if (item) {
          item.qty = qty;
        }
        const { total, final_total, qty: newQty } = recalculateTotals(state.carts);
        state.total = total;
        state.final_total = final_total;
        state.qty = newQty;
      },
      removeItem(state, action) {
        const id = action.payload;
        state.carts = state.carts.filter(item => item.id !== id);
        const { total, final_total, qty } = recalculateTotals(state.carts);
        state.total = total;
        state.final_total = final_total;
        state.qty = qty;
      }
    }
  });
  
  // 自動重新計算金額/數量（可以套優惠券）
function recalculateTotals(carts, coupon) {
    const total = carts.reduce((sum, item) => sum + (item.qty * item.product.price), 0);
    
    let final_total = total;
  
    if (coupon) {
      // 假設 coupon.percent 是折扣百分比，例如 10 代表打 9折
      const discount = (coupon.percent / 100) * total;
      final_total = total - discount;
    }
  
    const qty = carts.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  
    return { total, final_total, qty };
}
  
  export const { updateCartData, clearCartData, updateItemQty, removeItem, updateOrderInfo } = cartSlice.actions;
  export default cartSlice.reducer;