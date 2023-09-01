import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import apiClient from "../../utils/client";
import { ActiveIcon, BlockIcon, DeleteIcon, FileIcon } from "../icons/Icons";
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
import { BranchFiles } from "../BranchFiles/BranchFiles";
import AntdCustomPagination from "../Pagination/Pagination";
import "./Dashboard.css";
import { Menu, Dropdown, Button, Input } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import RegisterEmployee from "../registerEmployee/RegisterEmployee";
import ChangePassword from "../changePassword/ChangePassword"
const { Search } = Input;
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
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchFiles, setBranchFiles] = useState([]);
  const [showBranchFiles, setShowBranchFiles] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState("");
  const [showRegisterEmployee, setShowRegisterEmployee] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = getToken();

  const user = useAppSelector(getUser);
  const branch = useAppSelector(getUser).selectedBranch;

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const res = await apiClient.get("/user");
        setSelectedUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBusinessData();
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

  const blockUser = async (email) => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro que desea bloquear al usuario?",
        text: "¡El usuario no tendrá acceso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, bloquear",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await apiClient.put(`user/baneo/${email}`);
        const response = await apiClient.get("/user");
        const updatedUsers = response.data;
        setSelectedUser(updatedUsers);
        Swal.fire(`Usuario bloqueado`);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.error("Error al bloquear el usuario");
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
        Swal.fire(`Usuario activado`);
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

  const loadBranchFiles = async (branchId) => {
    try {
      const response = await apiClient.get(`/branch/${branchId}/files`);
      setBranchFiles(response.data);
      setShowBranchFiles(true);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBranch = async(branchId) => {
    const response = await apiClient.get(`/branch/${branchId}`);
    const branchToDelete = response.data;
    try {
      const result = await Swal.fire({
        title: `¿Está seguro que desea eliminar el establecimiento ${branchToDelete.nombreSede}?`,
        text: "¡Será eliminado y no podrá ver sus datos!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await apiClient.delete(`/branch/${branchId}`)
        const response = await apiClient.get("/user");
        const updatedBranches = response.data;
        setSelectedUser(updatedBranches);
        Swal.fire(`Establecimiento ${branchToDelete.nombreSede} eliminada`);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.error("Error al eliminar el Establecimiento/Obra");
      }
    }
  }


  const handleDeleteFile = (fileId) => {
    // Actualizar la lista de archivos eliminando el archivo con fileId
    setBranchFiles(branchFiles.filter((file) => file.id !== fileId));
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

  const handleRegisterEmployee = () => {
    setShowRegisterEmployee(true);
  };
  const handleBackToDashboard = () => {
    setShowRegisterEmployee(false);
  };

  const handleChangePsw = () => {
    setShowChangePassword(true);
  };
  const handleBackToMenu = () => {
    setShowChangePassword(false);
  };

  const handleBranchClick = async (branchId) => {
    setSelectedBranch(branchId);
    await loadBranchFiles(branchId);
    setShowBranchFiles(true);
    try {
      const response = await apiClient.get(`/branch/${branchId}`);
      setSelectedBranchName(response.data.nombreSede);
    } catch (error) {
      console.error(error);
      setSelectedBranchName("");
    }

    handleBranchFiles();
  };

  const handleBranchFiles = () => {
    setShowBranchFiles(true);
  };

  const handleBackToTable = () => {
    setShowBranchFiles(false);
  };

  const formatDate = useFormatDate();

  const isSuperAdminUser = () => {
    return user?.isSuperAdmin === true;
  };

  const currentFiles = branchFiles.slice(indexOfFirstFile, indexOfLastFile);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLoadFile}>
        Cargar archivos
      </Menu.Item>
      <Menu.Item key="2" onClick={handleChangePsw}>
        Cambiar contraseña
      </Menu.Item>
      {isSuperAdminUser() && (
        <Menu.Item key="3" onClick={handleRegister}>
          Registrar empresa
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="4" onClick={handleRegisterBranch}>
          Registrar establecimiento/obra
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="5" onClick={handleRegisterEmployee}>
          Registrar empleado
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          {!showFile &&
          !showRegister &&
          !showRegisterBranch &&
          !showBranchFiles &&
          !showRegisterEmployee &&
          !showChangePassword 
          ? (
            <TableContainer component={Paper}>
              <div style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Dropdown overlay={menu}>
                  <Button
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    Acciones <CaretDownOutlined />
                  </Button>
                </Dropdown>
              </div>
              <div>
                <Search
                  style={{ margin: "20px", maxWidth: "200px" }}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <Table
                style={{ marginTop: "20px" }}
                sx={{ minWidth: 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow style={{ textTransform: "uppercase" }}>
                    <TableCell align="justify">Empresa</TableCell>
                    <TableCell align="justify">Email Empresa</TableCell>
                    <TableCell align="justify">Establecimiento/Obra</TableCell>
                    <TableCell align="justify">Emails</TableCell>
                    <TableCell align="justify">Cuit</TableCell>
                    <TableCell align="justify">Ciudad</TableCell>
                    <TableCell align="justify">Dirección</TableCell>
                    <TableCell align="justify">Teléfono</TableCell>
                    <TableCell align="justify">Registrado</TableCell>
                    {isSuperAdminUser() && (
                      <TableCell align="justify">Bloquear</TableCell>
                    )}
                    {isSuperAdminUser() && (
                      <TableCell align="justify">Activar</TableCell>
                    )}
                    {isSuperAdminUser() && (
                      <TableCell align="justify">Archivos</TableCell>
                    )}
                    {isSuperAdminUser() && (
                      <TableCell align="justify">Eliminar</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchUsers(selectedUser).map((row) => (
                    <React.Fragment key={row.email}>
                      {row.branches.map((branch) => {
                        const userAccessEmails = branch.accessUser?.flat();
                        const isUserEmailMatch =
                          user?.email === row.email ||
                          userAccessEmails?.includes(user?.email);
                        const shouldRenderRow =
                          (isUserEmailMatch && !isSuperAdminUser()) ||
                          isSuperAdminUser();

                        return shouldRenderRow ? (
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
                            <TableCell align="justify">
                              <a href={`mailto:${row.email}`}>{row.email}</a>
                            </TableCell>
                            <TableCell align="justify">
                              {branch.nombreSede}
                            </TableCell>
                            <TableCell align="justify">
                              {branch.emails && branch.emails.length > 0 ? (
                                branch.emails.map((email, index) => (
                                  <React.Fragment key={index}>
                                    <a href={`mailto:${email}`}>{email}</a>
                                    {index !== branch.emails.length - 1 && ", "}
                                  </React.Fragment>
                                ))
                              ) : (
                                <span
                                  style={{
                                    display: "inline-block",
                                    textAlign: "center",
                                    width: "100%",
                                  }}
                                >
                                  -
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="justify">
                              {row.cuit || "-"}
                            </TableCell>
                            <TableCell align="center">
                              {branch.ciudad}
                            </TableCell>
                            <TableCell align="center">
                              {branch.direccion}
                            </TableCell>
                            <TableCell align="justify">
                              {branch.telefono || "-"}
                            </TableCell>
                            <TableCell align="justify">
                              {formatDate(branch.createdAt) || "-"}
                            </TableCell>
                            <TableCell align="center">
                              {isSuperAdminUser() && (
                                <BlockIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => blockUser(row.email)}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {isSuperAdminUser() && (
                                <ActiveIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => activeUser(row.email)}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {isSuperAdminUser() && (
                                <FileIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleBranchClick(branch.branchId);
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {isSuperAdminUser() && (
                                <DeleteIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    deleteBranch(branch.branchId);
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ) : null;
                      })}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : showFile ? (
            <>
              <File />
              <button
                style={{ marginTop: "50px", marginLeft: "20px" }}
                className="btn"
                onClick={handleBack}
              >
                Volver
              </button>
            </>
          ) : showRegister ? (
            <>
              <Register />
              <button
                style={{ margin: "50px" }}
                className="btn"
                onClick={handleBackTable}
              >
                Volver
              </button>
            </>
          ) : showRegisterBranch ? (
            <>
              <RegisterBranch />
              <button
                style={{ margin: "50px" }}
                className="btn"
                onClick={handleBackDashboard}
              >
                Volver
              </button>
            </>
          ) : showRegisterEmployee ? (
            <>
              <RegisterEmployee />
              <button
                style={{ margin: "50px" }}
                className="btn"
                onClick={handleBackToDashboard}
              >
                Volver
              </button>
            </>
           ) : showChangePassword ? (
              <>
                <ChangePassword email={user.email} />
                <button
                  style={{ margin: "50px" }}
                  className="btn"
                  onClick={handleBackToMenu}
                >
                  Volver
                </button>
              </>
          ) : null}
          {showBranchFiles && selectedBranch && (
            <>
              <h4 style={{margin:"50px"}}>Archivos de: {selectedBranchName}</h4>
              <BranchFiles
                branchFiles={currentFiles}
                onDeleteFile={handleDeleteFile}
              />
              {currentFiles.length > 0 && (
                <AntdCustomPagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(branchFiles.length / filesPerPage)}
                  onNextPage={handleNextPage}
                  onPrevPage={handlePrevPage}
                />
              )}

              <button className="btn" style={{ margin: "50px" }} onClick={handleBackToTable}>
                Volver
              </button>
            </>
          )}
          <div>
            {!showFile &&
            !showRegister &&
            !showRegisterBranch &&
            !showBranchFiles &&
            !showRegisterEmployee ? (
              <button className="boton-logout" onClick={signOff}>
                Cerrar sesión
              </button>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
