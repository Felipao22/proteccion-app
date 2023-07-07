import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
};
export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFilesData: (state, action) => {
      state.files = action.payload;
    },
    setFilesDataLogOut:(state) => {
      state.files= ''
    }
  },
});

export const { setFilesData, setFilesDataLogOut } = filesSlice.actions;

export const getFiles = (state) => state.files;

export default filesSlice.reducer;
