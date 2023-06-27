import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './filesSlice';

export const store = configureStore({
  reducer: {
    files: filesReducer,
  },
});
