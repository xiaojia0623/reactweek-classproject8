import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    messages:[],
};

const toastSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        pushMessage(state, action){
            const { title, text, status} = action.payload;
            const id = Date.now();
            state.messages.push({
                id, title, text, status
            })
        },
        removeMessage(state, action) {
            state.messages = state.messages.filter((msg) => msg.id !== action.payload);
        },
    }
})

export const {pushMessage, removeMessage} = toastSlice.actions;
export default toastSlice.reducer;