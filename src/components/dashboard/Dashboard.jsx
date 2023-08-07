import React, { useEffect, useState, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import apiClient from "../../utils/client";
import { ActiveIcon, DeleteIcon } from "../icons/Icons";
import Swal from "sweetalert2";
import { File } from "../file/File";
import useFormatDate from "../hooks/useFormattedDate";
import { getUser, setLogoutData, setUserData } from "../../redux/userSlice";
import { setFilesDataLogOut } from "../../redux/filesSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearToken, getToken } from "../../utils/token";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import Register from "../register/Register";
import RegisterBranch from "../registerBranch/RegisterBranch";

// Función de utilidad para implementar el debounce
// function debounce(func, delay) {
//   let timeoutId;
//   return function (...args) {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func.apply(this, args), delay);
//   };
// }

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFile, setShowFile] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisterBranch, setShowRegisterBranch] = useState(false);
  const [sessionActive, setSessionActive] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = getToken();

  const user = useAppSelector(getUser);
  const branch = useAppSelector(getUser).selectedBranch;

  // let inactivityTimer;

  // // Referencia para controlar si el mensaje de inactividad ya se ha mostrado
  // const inactivityMessageShownRef = useRef(false);

  // // Función para desloguear al usuario
  // const handleLogout = () => {
  //   dispatch(setLogoutData());
  //   dispatch(setFilesDataLogOut());
  //   clearToken();
  //   setSessionActive(false);
  //   if (!inactivityMessageShownRef.current) {
  //     inactivityMessageShownRef.current = true;
  //     NotificationSuccess("Sesión cerrada por inactividad.");
  //   }
  // };

  // // Función para reiniciar el temporizador de inactividad
  // const resetInactivityTimer = () => {
  //   clearTimeout(inactivityTimer);
  //   inactivityTimer = setTimeout(handleLogout, 3600000); // 1 hora en milisegundos
  // };

  // // Agregar el listener para el evento beforeunload y el temporizador de inactividad
  // useEffect(() => {
  //   let inactivityTimer = setTimeout(handleLogout, 3600000); // 1 hora en milisegundos

  //   const handleActivity = () => {
  //     resetInactivityTimer();
  //   };

  //   // Agregar los eventos para el temporizador de inactividad
  //   ['load', 'click', 'keydown', 'mousemove'].forEach((eventName) => {
  //     document.addEventListener(eventName, handleActivity);
  //   });

  //   // Agregar el listener para el evento beforeunload
  //   window.addEventListener("beforeunload", handleLogout);

  //   // Limpiar los eventos al desmontar el componente
  //   return () => {
  //     clearTimeout(inactivityTimer);
  //     // Remover los eventos para el temporizador de inactividad
  //     ['load', 'click', 'keydown', 'mousemove'].forEach((eventName) => {
  //       document.removeEventListener(eventName, handleActivity);
  //     });
  //     // Reiniciar la referencia para que el mensaje pueda mostrarse nuevamente
  //     inactivityMessageShownRef.current = false;
  //     // Remover el listener al desmontar el componente
  //     window.removeEventListener("beforeunload", handleLogout);
  //   };
  // }, []);

  // const inactivityMessageShownRef = useRef(false);
  //   // Función para desloguear al usuario
  //   const handleLogout = () => {
  //     dispatch(setLogoutData());
  //     dispatch(setFilesDataLogOut());
  //     clearToken();
  //     setSessionActive(false);
  //     if (!inactivityMessageShownRef.current) {
  //       inactivityMessageShownRef.current = true;
  //       NotificationSuccess("Sesión cerrada por inactividad.");
  //     }
  //   };

  //   // Función para reiniciar el temporizador de inactividad con debounce
  //   const resetInactivityTimer = () => {
  //     clearTimeout(inactivityTimer);
  //     inactivityTimer = setTimeout(handleLogout, 3600000); // 1 hora en milisegundos
  //   };

  //   // Agregar el listener para el evento beforeunload y el temporizador de inactividad
  //   useEffect(() => {
  //     let inactivityTimer = setTimeout(handleLogout, 3600000); // 1 hora en milisegundos

  //     const handleActivity = () => {
  //       resetInactivityTimer();
  //     };

  //     // Agregar los eventos para el temporizador de inactividad
  //     const debouncedActivityHandler = debounce(handleActivity, 1000); // Tiempo de debounce en milisegundos
  //     ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
  //       document.addEventListener(eventName, debouncedActivityHandler);
  //     });

  //     // Agregar el listener para el evento beforeunload
  //     window.addEventListener("beforeunload", handleLogout);

  //     // Limpiar los eventos al desmontar el componente
  //     return () => {
  //       clearTimeout(inactivityTimer);
  //       // Remover los eventos para el temporizador de inactividad
  //       ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
  //         document.removeEventListener(eventName, debouncedActivityHandler);
  //       });
  //       // Reiniciar la referencia para que el mensaje pueda mostrarse nuevamente
  //       inactivityMessageShownRef.current = false;
  //       // Remover el listener al desmontar el componente
  //       window.removeEventListener("beforeunload", handleLogout);
  //     };
  //   }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiClient.get("/user");
        setSelectedUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [branch]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token && user) {
          const { email } = user;
          const { data } = await apiClient.get(`/user/${email}`);
          if (data) {
            const user = {
              email: data.email,
              userId: data.userId,
              authToken: data.authToken,
              isAdmin: data.isAdmin,
              isSuperAdmin: data.isSuperAdmin,
            };
            dispatch(setUserData(user));
            setLoading(false);
          }
        }
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };
    fetchUserData();
  }, [token, user, dispatch]);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
  };

  const searchUsers = (rows) => {
    const escapedQ = escapeRegExp(q.trim());
    const searchRegex = new RegExp(escapedQ, "i");

    return rows.filter(
      (row) =>
        searchRegex.test(row.email) ||
        searchRegex.test(row.nombreEmpresa) ||
        searchRegex.test(row.branches.ciudad) ||
        searchRegex.test(row.branches.nombreEstablecimiento)
    );
  };

  const signOff = async () => {
    try {
      const res = await apiClient.post("/user/logout");
      dispatch(setLogoutData());
      dispatch(setFilesDataLogOut());
      clearToken();
      navigate("/");
      NotificationSuccess(res.data.message);
    } catch (error) {
      NotificationFailure(response.data.error);
    }
  };

  const deleteUser = async (email) => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro que desea eliminar el usuario?",
        text: "¡No podrá revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await apiClient.put(`user/baneo/${email}`);
        const response = await apiClient.get("/user");
        const updatedUsers = response.data;
        // const updatedUsers = res.data
        setSelectedUser(updatedUsers);
        Swal.fire(`Usuario: ${updatedUsers[0].nombreEmpresa} eliminado`);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.error("Error al eliminar el usuario");
      }
    }
  };

  const activeUser = async (email) => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro que desea activar el usuario?",
        text: "¡Volverá a estar activo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, activar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await apiClient.put(`user/activar/${email}`);
        const response = await apiClient.get("/user");
        const updatedUsers = response.data;
        setSelectedUser(updatedUsers);
        Swal.fire(`Usuario: ${updatedUsers[0].nombreEmpresa} activado `);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.error("Error al activar el usuario");
      }
    }
  };

  const handleLoadFile = () => {
    setShowFile(true);
  };
  const handleBack = () => {
    setShowFile(false);
  };

  const handleRegister = () => {
    setShowRegister(true);
  };
  const handleBackTable = () => {
    setShowRegister(false);
  };

  const handleRegisterBranch = () => {
    setShowRegisterBranch(true);
  };
  const handleBackDashboard = () => {
    setShowRegisterBranch(false);
  };

  const formatDate = useFormatDate();

  const isSuperAdminUser = () => {
    return user?.isSuperAdmin === true;
  };

  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          {!showFile && !showRegister && !showRegisterBranch ? (
            <TableContainer component={Paper}>
              <div>
                <button className='btn btn-primary"' onClick={handleLoadFile}>
                  Cargar archivos
                </button>
                <button className="btn btn-primary" onClick={handleRegister}>
                  Registrar empresa
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleRegisterBranch}
                >
                  Registrar establecimiento/obra
                </button>
              </div>
              <div>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="justify">Empresa</TableCell>
                    <TableCell align="justify">Email</TableCell>
                    <TableCell align="justify">Establecimiento/Obra</TableCell>
                    <TableCell align="justify">Cuit</TableCell>
                    <TableCell align="justify">Ciudad</TableCell>
                    <TableCell align="justify">Dirección</TableCell>
                    <TableCell align="justify">Teléfono</TableCell>
                    <TableCell align="justify">Registrado</TableCell>
                    {isSuperAdminUser() && (
                      <TableCell align="justify">Eliminar</TableCell>
                    )}
                    {isSuperAdminUser() && (
                      <TableCell align="justify">Activar</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchUsers(selectedUser).map((row) => (
                    <React.Fragment key={row.email}>
                      {row.branches.map((branch) => (
                        <TableRow
                          key={branch.branchId}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={
                            row.active === false
                              ? { backgroundColor: "#FB4100", color: "white" }
                              : {}
                          }
                        >
                          <TableCell component="th" scope="row">
                            {row.nombreEmpresa}
                          </TableCell>
                          <TableCell align="justify">{row.email}</TableCell>
                          <TableCell align="justify">
                            {branch.nombreSede}
                          </TableCell>
                          <TableCell align="justify">
                            {row.cuit || "-"}
                          </TableCell>
                          <TableCell align="justify">{branch.ciudad}</TableCell>
                          <TableCell align="justify">
                            {branch.direccion}
                          </TableCell>
                          <TableCell align="justify">
                            {branch.telefono || "-"}
                          </TableCell>
                          <TableCell align="justify">
                            {formatDate(branch.createdAt) || "-"}
                          </TableCell>
                          <TableCell align="justify">
                            {isSuperAdminUser() && (
                              <DeleteIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteUser(row.email)}
                              />
                            )}
                          </TableCell>
                          <TableCell align="justify">
                            {isSuperAdminUser() && (
                              <ActiveIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => activeUser(row.email)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : showFile ? (
            <>
              <File />
              <button className="btn" onClick={handleBack}>
                Volver
              </button>
            </>
          ) : showRegister ? (
            <>
              <Register />
              <button className="btn" onClick={handleBackTable}>
                Volver
              </button>
            </>
          ) : showRegisterBranch ? (
            <>
              <RegisterBranch />
              <button className="btn" onClick={handleBackDashboard}>
                Volver
              </button>
            </>
          ) : null}
        </div>
      )}
      <div>
        <button onClick={signOff}>Cerrar sesión</button>
      </div>
    </>
  );
}
