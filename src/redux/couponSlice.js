import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_PATH = import.meta.env.VITE_APP_API_PATH;

// thunk：驗證優惠券
export const applyCoupon = createAsyncThunk(
  'coupon/applyCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/coupon`,
        { data: { code } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Coupon error');
    }
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    code: '',
    percent: 0,
    finalTotal: 0,
    status: 'idle',
    error: null
  },
  reducers: {
    resetCoupon: (state) => {
      state.code = '';
      state.percent = 0;
      state.finalTotal = 0;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.code = action.meta.arg;
        state.percent = action.payload.data.percent;      // 折扣百分比
        state.finalTotal = action.payload.data.final_total;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetCoupon } = couponSlice.actions;
export default couponSlice.reducer;
