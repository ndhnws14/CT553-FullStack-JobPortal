import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs:[],
        searchedQuery: ""
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload || [];
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        addJob: (state, action) => {
            state.allJobs = [action.payload, ...state.allJobs];
        },
        removeJob: (state, action) => {
            const jobId = action.payload;
            state.allJobs = state.allJobs.filter(job => job._id !== jobId);
        },
        removeAppliedJob: (state, action) => {
            const applicantId = action.payload;
            state.allAppliedJobs = state.allAppliedJobs.filter(app => app._id !== applicantId);
        }
    }
});

export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs, 
    setSearchJobByText, 
    setAppliedJobs, 
    setSearchedQuery,
    addJob,
    removeJob,
    removeAppliedJob
} = jobSlice.actions;
export default jobSlice.reducer;