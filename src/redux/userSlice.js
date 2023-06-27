import { createSlice } from '@reduxjs/toolkit';

const initialState={
    email:''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
        // state.id= action.payload.id;
        state.email= action.payload.email;
        // state.file = action.payload.file
    },
}
//     setUserName: (state, action) => {
//       state.name = action.payload;
//     },
//     setLoginData: (state, action) => {
//       state.userId = action.payload.userId;
//       state.authToken = action.payload.authToken;

//     },
//     setUserData: (state, action) => {
//       state.name = action.payload.name;
//       state.lastName = action.payload.lastName;
//       state.email = action.payload.email;
//       state.photo = action.payload.photo;
//     },
//     setLogoutData: (state) => {
//       state.name = '';
//       state.lastName = '';
//       state.email = '';
//       state.photo = '';
//       state.userId = '';
//       state.authToken = '';
//     }
//   }
});

export const { setUserData } = userSlice.actions;

export const getUser = (state) => state.user;

export default userSlice.reducer;
