import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatData: (state, action) => {
      state.channels = action.payload.channels ?? [];
      state.messages = action.payload.messages ?? [];
      state.currentChannelId = action.payload.currentChannelId
        ?? action.payload.channels?.[0]?.id
        ?? null;
    },
  },
});

export const { setChatData } = chatSlice.actions;

const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
  },
});

export default store;
