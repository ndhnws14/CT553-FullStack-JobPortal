import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        companies: [],
        searchCompanyByText: ""
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setAllCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        },
        removeCompany: (state, action) => {
            const companyId = action.payload;
            state.companies = state.companies.filter(company => company._id !== companyId);
        }
    }
});

export const { setSingleCompany, setAllCompanies, setSearchCompanyByText, removeCompany } = companySlice.actions;
export default companySlice.reducer;
