import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: null,
    allApplicants: []
  },
  reducers: {
    setAllApplicants:(state,action) => {
      state.applicants = action.payload;
    },
    setAllEmployerApplicants: (state, action) => {
      state.allApplicants = action.payload;
    },
    updateApplicationStatus: (state, action) => {
      const { id, status } = action.payload;
      if (state.applicants?.applications) {
        state.applicants.applications = state.applicants.applications.map(app =>
          app._id === id ? { ...app, status } : app
        );
      }
    },
    updateInterviewDate: (state, action) => {
      const { id, interviewDate } = action.payload;
      if (state.applicants?.applications) {
        state.applicants.applications = state.applicants.applications.map(app =>
          app._id === id ? { ...app, interviewDate } : app
        );
      }
    } 
  }
});

export const {
  setAllApplicants,
  setAllEmployerApplicants,
  updateApplicationStatus,
  updateInterviewDate
} = applicationSlice.actions;
export default applicationSlice.reducer;
