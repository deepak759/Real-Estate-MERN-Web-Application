import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    signInFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
     
      state.loading = true;
    },
    updateUserFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    deleteUserStart: (state) => {
     
      state.loading = true;
    },
    deleteUserFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    logOutUserStart: (state) => {
     
      state.loading = true;
    },
    logOutUserFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logOutUserSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
});
export const { signInFail, signInStart, signInSuccess, deleteUserFail,deleteUserStart,deleteUserSuccess, updateUserFail,updateUserStart,updateUserSuccess,logOutUserFail,logOutUserStart,logOutUserSuccess } = userSlice.actions;
export default userSlice.reducer;
