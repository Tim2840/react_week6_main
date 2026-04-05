import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage(state, action) {
      const id = Date.now().toString();
      state.messages.push({
        id,
        type: action.payload.type || 'success', // 'success' or 'danger'
        title: action.payload.title || '通知',
        text: action.payload.text || '',
      });
    },
    removeMessage(state, action) {
      state.messages = state.messages.filter((msg) => msg.id !== action.payload);
    },
  },
});

export const { addMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;
