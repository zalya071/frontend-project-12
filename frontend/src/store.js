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
    addMessage: (state, action) => {
      const exists = state.messages.some((message) => message.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      const exists = state.channels.some((channel) => channel.id === action.payload.id);
      if (!exists) {
        state.channels.push(action.payload);
      }
    },
    removeChannel: (state, action) => {
      const channelId = action.payload;
      state.channels = state.channels.filter((channel) => channel.id !== channelId);
      state.messages = state.messages.filter((message) => message.channelId !== channelId);

      if (state.currentChannelId === channelId) {
        state.currentChannelId = state.channels[0]?.id ?? null;
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find((item) => item.id === id);

      if (channel) {
        channel.name = name;
      }
    },
  },
});

export const {
  setChatData,
  addMessage,
  setCurrentChannelId,
  addChannel,
  removeChannel,
  renameChannel,
} = chatSlice.actions;

const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
  },
});

export default store;
