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
        removeMessage(state, action){
            const message_id = action.payload;
            const index = state.messages.findIndex((message) => {
                return message.id === message_id
            })
            if (index !== -1){
                state.messages.splice(index, 1);
            }
        }
    }
})

export const {pushMessage, removeMessage} = toastSlice.actions;
export default toastSlice.reducer;