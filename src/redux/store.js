import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './filesSlice';
import userReducer, { getUserDataFromCookies } from './userSlice';
import tableReducer from "./tableSlice"

const preloadedState = {
  // user: getUserDataFromLocalStorage(),
  user: getUserDataFromCookies(),
};

export const store = configureStore({
  reducer: {
    files: filesReducer,
    user: userReducer,
    table: tableReducer
  },
  preloadedState,
});
