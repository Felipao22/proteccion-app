// import { createSlice } from '@reduxjs/toolkit';

// const initialState={
//     email:'',
//     password:'',
//     userId:'',
//     authToken:'',
//     nombreEmpresa: '',
//     files: [],
//     cuit:'',
//     nombreEstablecimiento: '',
//     ciudad: '',
//     provincia: '',
//     telefono: '',
//     createdAt: '',
//     isAdmin: ''
// }

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUserData: (state, action) => {
//         state.email= action.payload.email;
//         state.nombreEmpresa = action.payload.nombreEmpresa;
//         state.cuit = action.payload.cuit;
//         state.ciudad = action.payload.ciudad;
//         state.provincia = action.payload.provincia;
//         state.nombreEstablecimiento = action.payload.nombreEstablecimiento;
//         state.telefono = action.payload.telefono
//         state.isAdmin = action.payload.isAdmin
//     },
//     setLoginData: (state, action) => {
//       state.userId = action.payload.userId;
//       state.authToken = action.payload.authToken;
//       state.email = action.payload.email
//     },
//     setLogoutData: (state) => {
//             state.email = '';
//             state.nombreEmpresa = '';
//             state.files = '';
//             state.cuit = '';
//             state.nombreEstablecimiento = '';
//             state.ciudad = '';
//             state.provincia = '';
//             state.telefono = '';
//             state.createdAt = '';
//             state.userId = '';
//             state.authToken = '';
//           }
// }
// });

// export const { setUserData, setLoginData, setLogoutData } = userSlice.actions;

// export const getUser = (state) => state.user;

// export default userSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const persistedState = localStorage.getItem('__redux__state__');
// const DEFAULT_STATE = {
//   email: '',
//   password: '',
//   userId: '',
//   authToken: '',
//   nombreEmpresa: '',
//   files: [],
//   cuit: '',
//   nombreEstablecimiento: '',
//   ciudad: '',
//   provincia: '',
//   telefono: '',
//   createdAt: '',
//   isAdmin: '',
// };

// const initialState = persistedState ? JSON.parse(persistedState).user : DEFAULT_STATE;

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUserData: (state, action) => {
//       state.email = action.payload.email;
//       state.nombreEmpresa = action.payload.nombreEmpresa;
//       state.cuit = action.payload.cuit;
//       state.ciudad = action.payload.ciudad;
//       state.provincia = action.payload.provincia;
//       state.nombreEstablecimiento = action.payload.nombreEstablecimiento;
//       state.telefono = action.payload.telefono;
//       state.isAdmin = action.payload.isAdmin;
//     },
//     setLoginData: (state, action) => {
//       state.userId = action.payload.userId;
//       state.authToken = action.payload.authToken;
//       state.email = action.payload.email;
//     },
//     setLogoutData: (state) => {
//       state.email = '';
//       state.nombreEmpresa = '';
//       state.files = '';
//       state.cuit = '';
//       state.nombreEstablecimiento = '';
//       state.ciudad = '';
//       state.provincia = '';
//       state.telefono = '';
//       state.createdAt = '';
//       state.userId = '';
//       state.authToken = '';
//     },
//   },
// });

// export const { setUserData, setLoginData, setLogoutData } = userSlice.actions;

// export const getUser = (state) => state.user;

// // Agregar el siguiente código para guardar la información del usuario en localStorage
// const saveStateToLocalStorage = (state) => {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem('__redux__state__', serializedState);
//   } catch (error) {
//     // Manejar los errores de guardado en localStorage aquí
//   }
// };

// // Agregar el siguiente código para suscribirse a los cambios de estado y guardarlos en localStorage
// userSlice.subscribe(() => {
//   saveStateToLocalStorage({ user: getUser(store.getState()) });
// });

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  userId: "",
  authToken: "",
  nombreEmpresa: "",
  files: [],
  cuit: "",
  nombreEstablecimiento: "",
  ciudad: "",
  provincia: "",
  telefono: "",
  direccion: "",
  createdAt: "",
  isAdmin: true,
};

export const getUserDataFromLocalStorage = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : initialState;
};

export const userSlice = createSlice({
  name: "user",
  initialState: getUserDataFromLocalStorage(),
  reducers: {
    setUserData: (state, action) => {
      const {
        email,
        nombreEmpresa,
        cuit,
        ciudad,
        provincia,
        nombreEstablecimiento,
        telefono,
        isAdmin,
        direccion,
      } = action.payload;
      state.email = email;
      state.nombreEmpresa = nombreEmpresa;
      state.cuit = cuit;
      state.ciudad = ciudad;
      state.provincia = provincia;
      state.nombreEstablecimiento = nombreEstablecimiento;
      state.telefono = telefono;
      state.isAdmin = isAdmin === false;
      state.direccion = direccion;
      // Guardar en Local Storage
      localStorage.setItem("user", JSON.stringify(state));
    },
    setLoginData: (state, action) => {
      const { userId, authToken, email } = action.payload;
      state.userId = userId;
      state.authToken = authToken;
      state.email = email;
      // Guardar en Local Storage
      localStorage.setItem("user", JSON.stringify(state));
    },
    setLogoutData: (state) => {
      // Restablecer a initialState
      Object.assign(state, initialState);
      // Eliminar del Local Storage
      localStorage.removeItem("user");
    },
  },
});

export const { setUserData, setLoginData, setLogoutData } = userSlice.actions;

export const getUser = (state) => state.user;

export default userSlice.reducer;
