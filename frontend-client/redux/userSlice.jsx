import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    success: null,
    token: null,
    currentUser: null, // Add currentUser to the initial state
  },
  reducers: {
    singInstart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    signInsuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.token = action.payload.token;
      state.currentUser = action.payload.user; // Set currentUser from the action payload
      state.error = null;
    },
    signInfailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
      state.currentUser = null; // Clear currentUser on failure
    },
    updateUserStart: (state, action) => {
      state.loading = true;
    },
    updateuserSuccess:(state, action)=>{
      state.loading = false;
      state.success = action.payload.message;
      state.error = null;
    },
    updateuserFailure:(state, action)=>{
      state.loading = false;
      state.error = action.payload.message;
    },
    
  },
});

export const { singInstart, signInsuccess, signInfailure ,updateUserStart} = userSlice.actions;
export default userSlice.reducer;
