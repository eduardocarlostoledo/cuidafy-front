import { createSlice } from "@reduxjs/toolkit";

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    message: "",
  },
  reducers: {
    addMessage: (state, action) => {
      state.message = action.payload;
    },
    removeMessage: (state, action) => {
      state.message = "";
    },
  },
});

export const { addMessage, removeMessage } = notificationsSlice.actions;

export default notificationsSlice.reducer;
