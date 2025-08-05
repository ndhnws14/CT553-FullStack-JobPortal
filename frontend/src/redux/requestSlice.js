import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requestSkill",
    initialState: {
        requestSkills: [],
    },
    reducers: {
        setRequestSkills: (state, action) => {
            state.requestSkills = action.payload;
        },
        updateRequestStatus: (state, action) => {
            const { id, status } = action.payload;
            state.requestSkills = state.requestSkills.map(req =>
                req._id === id ? { ...req, status } : req
            );
        },
        addSkillRequest: (state, action) => {
            state.requestSkills = [action.payload, ...state.requestSkills];
        },
    }
});

export const { setRequestSkills, updateRequestStatus, addSkillRequest } = requestSlice.actions;
export default requestSlice.reducer;
