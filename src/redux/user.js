import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
        userAddress: null,
        contactDetail: null
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateAddress: (state, action) => {
            state.currentUser = action.payload.currentUser;
            state.userAddress = action.payload.addressData;
        },
        logout: (state) => {
            state.isFetching = false;
            state.currentUser = null;
            state.error = false;
            state.userAddress = null;
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, updateAddress, logout } = userSlice.actions;
export default userSlice.reducer;