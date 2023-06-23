import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
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
  },
});

export const { set_username } = userSlice.actions;

export default userSlice.reducer;
