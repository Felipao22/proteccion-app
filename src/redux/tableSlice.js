// En un nuevo archivo, por ejemplo, tableSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tableData: [], // Los datos de la tabla, puedes inicializarla como sea necesario
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    updateTableData: (state, action) => {
      state.tableData = action.payload; // Actualiza los datos de la tabla
    },
  },
});

export const { updateTableData } = tableSlice.actions;

export const getTableData = (state) => state.table.tableData;

export default tableSlice.reducer;
