import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './filesSlice';
import userReducer, { getUserDataFromLocalStorage } from './userSlice';

const preloadedState = {
  user: getUserDataFromLocalStorage(),
};

export const store = configureStore({
  reducer: {
    files: filesReducer,
    user: userReducer,
  },
  preloadedState,
});
