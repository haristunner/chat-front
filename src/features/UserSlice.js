import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  loginState: false,
  status: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    set_username: (state, action) => {
      console.log(action.payload);
      state.userName = action.payload;
    },

    set_loginState: (state, action) => {
      console.log(action.payload, "loginstate");
      state.loginState = action.payload;
    },
  },
});

export const { set_username, set_loginState } = userSlice.actions;

export default userSlice.reducer;
