import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        allUsers: []
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        updateUserProfile(state, action) {
            state.user = { ...state.user, ...action.payload };
        }

    }
});
export const {setLoading, setUser, setAllUsers, updateUserProfile} = authSlice.actions;
export default authSlice.reducer;