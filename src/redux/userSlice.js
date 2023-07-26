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
  isAdmin: false,
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
      state.isAdmin = isAdmin;
      state.direccion = direccion;
      // Guardar en Local Storage
      localStorage.setItem("user", JSON.stringify(state));
    },
    setLoginData: (state, action) => {
      const { userId, authToken, email, isAdmin } = action.payload;
      state.userId = userId;
      state.authToken = authToken;
      state.email = email;
      state.isAdmin = isAdmin;
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

export const { setUserData, setLoginData, setLogoutData, setSelectedBranch } = userSlice.actions;

export const getUser = (state) => state.user;

export default userSlice.reducer;