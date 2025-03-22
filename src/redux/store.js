import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import messageReducer from './toastSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    message: messageReducer,
  },
});

export default store;