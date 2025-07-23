import { createSlice } from "@reduxjs/toolkit";

const cvSlice = createSlice({
    name: "cv",
    initialState: {
        cv: null
    },
    reducers: {
        setCV: (state, action) => {
            state.cv = action.payload;
        },
        removeCV: (state) => {
            state.cv = null;
        },
    }
});

export const { setCV, removeCV } = cvSlice.actions;
export default cvSlice.reducer;
