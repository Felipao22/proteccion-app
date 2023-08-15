// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   email: "",
//   password: "",
//   userId: "",
//   authToken: "",
//   nombreEmpresa: "",
//   createdAt: "",
//   isAdmin: false,
//   isSuperAdmin: false,
//   selectedBranch: [],
// };

// // export const getUserDataFromLocalStorage = () => {
// //   const userData = localStorage.getItem("user");
// //   const userClosed = localStorage.getItem("userClosed");

// //   // Verificar si el usuario se cerró intencionalmente, si es así, retornar initialState
// //   if (userClosed === "true") {
// //     localStorage.removeItem("userClosed"); // Limpiar la marca del Local Storage
// //     return initialState;
// //   }

// //   return userData ? JSON.parse(userData) : initialState;
// // };

// export const getUserDataFromLocalStorage = () => {
//   const userData = localStorage.getItem("user");
//   return userData ? JSON.parse(userData) : initialState;
// };

// export const userSlice = createSlice({
//   name: "user",
//   initialState: getUserDataFromLocalStorage(),
//   reducers: {
//     setUserData: (state, action) => {
//       const { email, nombreEmpresa, cuit, isAdmin, isSuperAdmin } =
//         action.payload;
//       state.email = email;
//       state.nombreEmpresa = nombreEmpresa;
//       state.cuit = cuit;
//       state.isAdmin = isAdmin;
//       state.isSuperAdmin = isSuperAdmin;
//       // Guardar en Local Storage
//       localStorage.setItem("user", JSON.stringify(state));
//     },
//     setLoginData: (state, action) => {
//       const { userId, authToken, email, isAdmin, isSuperAdmin } =
//         action.payload;
//       state.userId = userId;
//       state.authToken = authToken;
//       state.email = email;
//       state.isAdmin = isAdmin;
//       state.isSuperAdmin = isSuperAdmin;
//       // Guardar en Local Storage
//       localStorage.setItem("user", JSON.stringify(state));
//     },
//     setLogoutData: (state) => {
//       // Restablecer a initialState
//       Object.assign(state, initialState);
//       // Eliminar del Local Storage
//       localStorage.removeItem("user");
//     },
//     setSelectedBranch: (state, action) => {
//       state.selectedBranch = action.payload;
//     },
//   },
// });

// export const { setUserData, setLoginData, setLogoutData, setSelectedBranch } =
//   userSlice.actions;

// export const getUser = (state) => state.user;

// export default userSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie } from "../utils/cookieUtils"; // Importar funciones para manipular cookies

const initialState = {
  email: "",
  password: "",
  userId: "",
  authToken: "",
  nombreEmpresa: "",
  createdAt: "",
  isAdmin: false,
  isSuperAdmin: false,
  selectedBranch: [],
};

export const getUserDataFromCookies = () => {
  const userData = getCookie("user");
  return userData ? JSON.parse(userData) : initialState;
};

export const userSlice = createSlice({
  name: "user",
  initialState: getUserDataFromCookies(),
  reducers: {
    setUserData: (state, action) => {
      const { email, nombreEmpresa, cuit, isAdmin, isSuperAdmin } =
        action.payload;
      state.email = email;
      state.nombreEmpresa = nombreEmpresa;
      state.cuit = cuit;
      state.isAdmin = isAdmin;
      state.isSuperAdmin = isSuperAdmin;
      setCookie("user", JSON.stringify(state)); // Guardar en la cookie
    },
    setLoginData: (state, action) => {
      const { userId, authToken, email, isAdmin, isSuperAdmin } =
        action.payload;
      state.userId = userId;
      state.authToken = authToken;
      state.email = email;
      state.isAdmin = isAdmin;
      state.isSuperAdmin = isSuperAdmin;
      setCookie("user", JSON.stringify(state)); // Guardar en la cookie
    },
    setLogoutData: (state) => {
      Object.assign(state, initialState);
      deleteCookie("user"); // Eliminar la cookie
    },
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
  },
});

export const { setUserData, setLoginData, setLogoutData, setSelectedBranch } =
  userSlice.actions;

export const getUser = (state) => state.user;

export default userSlice.reducer;

