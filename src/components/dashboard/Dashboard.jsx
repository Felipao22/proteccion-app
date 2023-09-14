import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import apiClient from "../../utils/client";
import Swal from "sweetalert2";
import { File } from "../file/File";
import Loading from "../loading/Loading"
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
import RegisterBranch from "../registerBranch/RegisterBranch";
import { UserFiles } from "../userFiles/UserFiles";
import AntdCustomPagination from "../Pagination/Pagination";
import "./Dashboard.css";
import { Menu, Dropdown, Button, Input } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import RegisterEmployee from "../registerEmployee/RegisterEmployee";
import ChangePassword from "../changePassword/ChangePassword";
const { Search } = Input;

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFile, setShowFile] = useState(false);
  const [showRegisterBranch, setShowRegisterBranch] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [userFiles, setUserFiles] = useState([]);
  const [showUserFiles, setShowUserFiles] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");
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

  // const tableData = useAppSelector(getTableData).tableData;
  // console.log(tableData)
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
              name: data.name,
              lastName: data.lastName,
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
        !row.isAdmin &&
        (searchRegex.test(row.email) ||
          searchRegex.test(row.nombreEmpresa) ||
          searchRegex.test(row.ciudad) ||
          searchRegex.test(row.nombreSede))
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
    const response = await apiClient.get(`/user/${email}`);
    const userToBlock = response.data;
    try {
      const result = await Swal.fire({
        title: `¿Está seguro que desea bloquear al usuario: ${userToBlock.nombreSede}?`,
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
        Swal.fire(`Usuario ${userToBlock.nombreSede} bloqueado`);
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
    const response = await apiClient.get(`/user/${email}`);
    const userToActive = response.data;
    try {
      const result = await Swal.fire({
        title: `¿Está seguro que desea activar el usuario: ${userToActive.nombreSede}?`,
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
        console.log(updatedUsers);
        setSelectedUser(updatedUsers);
        Swal.fire(`Usuario ${userToActive.nombreSede} activado`);
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

  const loadBranchFiles = async (email) => {
    try {
      const response = await apiClient.get(`/user/${email}/files`);
      setUserFiles(response.data);
      setShowUserFiles(true);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBranch = async (email) => {
    const response = await apiClient.get(`/user/${email}`);
    const userToDelete = response.data;
    try {
      const result = await Swal.fire({
        title: `¿Está seguro que desea eliminar el establecimiento ${userToDelete.nombreSede}?`,
        text: "¡Será eliminado y no podrá ver sus datos!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await apiClient.delete(`/user/${email}`);
        const response = await apiClient.get("/user");
        const updatedBranches = response.data;
        setSelectedUser(updatedBranches);
        Swal.fire(`Establecimiento ${userToDelete.nombreSede} eliminada`);
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
  };

  const handleDeleteFile = (fileId) => {
    // Actualizar la lista de archivos eliminando el archivo con fileId
    setUserFiles(userFiles.filter((file) => file.id !== fileId));
  };

  const handleActions = {
    loadFile: () => setShowFile(true),
    back: () => setShowFile(false),
    registerBranch: () => setShowRegisterBranch(true),
    backDashboard: () => setShowRegisterBranch(false),
    registerEmployee: () => setShowRegisterEmployee(true),
    backToDashboard: () => setShowRegisterEmployee(false),
    changePassword: () => setShowChangePassword(true),
    backToMenu: () => setShowChangePassword(false),
    branchFiles: () => setShowUserFiles(true),
    backToTable: () => setShowUserFiles(false),
  };

  const handleActionAdmin = (action) => {
    if (handleActions[action]) {
      handleActions[action]();
    }
  };

  const handleBranchClick = async (email) => {
    setSelectedUserEmail(email);
    await loadBranchFiles(email);
    setShowUserFiles(true);
    try {
      const response = await apiClient.get(`/user/${email}`);
      setSelectedUserName(response.data.nombreSede);
    } catch (error) {
      console.error(error);
      setSelectedUserName("");
    }
  };

  const formatDate = useFormatDate();

  const isSuperAdminUser = () => {
    return user?.isSuperAdmin === true;
  };

  const sortedFiles = userFiles.toSorted((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const currentFiles = sortedFiles.slice(indexOfFirstFile, indexOfLastFile);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleActionAdmin("loadFile")}>
        Cargar archivos
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleActionAdmin("changePassword")}>
        Cambiar contraseña
      </Menu.Item>
      {isSuperAdminUser() && (
        <Menu.Item key="3" onClick={() => handleActionAdmin("registerBranch")}>
          Registrar establecimiento/obra
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item
          key="4"
          onClick={() => handleActionAdmin("registerEmployee")}
        >
          Registrar empleado
        </Menu.Item>
      )}
    </Menu>
  );

  const acciones = (email) => (
    <Menu>
      {isSuperAdminUser() && (
        <Menu.Item key="1" onClick={() => handleAction("bloquear", email)}>
          Bloquear
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="2" onClick={() => handleAction("activar", email)}>
          Activar
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="3" onClick={() => handleAction("archivos", email)}>
          Archivos
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="4" onClick={() => handleAction("eliminar", email)}>
          Eliminar
        </Menu.Item>
      )}
    </Menu>
  );

  const handleAction = (action, email) => {
    if (isSuperAdminUser()) {
      switch (action) {
        case "bloquear":
          blockUser(email);
          break;
        case "activar":
          activeUser(email);
          break;
        case "archivos":
          handleBranchClick(email);
          break;
        case "eliminar":
          deleteBranch(email);
          break;
        default:
          break;
      }
    }
  };

  const userLogin = user.email;

  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          {!showFile &&
          !showRegisterBranch &&
          !showUserFiles &&
          !showRegisterEmployee &&
          !showChangePassword ? (
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
                    <TableCell align="justify">Email Jefe</TableCell>
                    <TableCell align="justify">Emails</TableCell>
                    <TableCell align="justify">Cuit</TableCell>
                    <TableCell align="justify">Ciudad</TableCell>
                    <TableCell align="justify">Dirección</TableCell>
                    <TableCell align="justify">Teléfono</TableCell>
                    <TableCell align="justify">Registrado</TableCell>
                    {isSuperAdminUser() && (
                      <TableCell align="justify">Acciones</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchUsers(selectedUser).map((row) => {
                    const userAccessEmails = row.accessUser?.flat();
                    const isUserEmailMatch =
                      user?.email === row.email ||
                      userAccessEmails?.includes(user?.email);
                    const shouldRenderRow =
                      (isUserEmailMatch && !isSuperAdminUser()) ||
                      isSuperAdminUser();

                    return shouldRenderRow ? (
                      <TableRow
                        key={row.userId}
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
                        <TableCell align="justify">{row.nombreSede}</TableCell>
                        <TableCell align="justify">
                          {row.emailJefe && row.emailJefe.length > 0 ? (
                            <a href={`mailto:${row.emailJefe}`}>
                              {row.emailJefe}
                            </a>
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
                          {row.emails && row.emails.length > 0 ? (
                            row.emails.map((email, index) => (
                              <React.Fragment key={index}>
                                <a href={`mailto:${email}`}>{email}</a>
                                {index !== row.emails.length - 1 && ", "}
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
                        <TableCell align="justify">{row.cuit || "-"}</TableCell>
                        <TableCell align="center">{row.ciudad}</TableCell>
                        <TableCell align="center">{row.direccion}</TableCell>
                        <TableCell align="justify">
                          {row.telefono || "-"}
                        </TableCell>
                        <TableCell align="justify">
                          {formatDate(row.createdAt) || "-"}
                        </TableCell>
                        {isSuperAdminUser() && (
                          <TableCell align="center">
                            <Dropdown overlay={acciones(row.email)}>
                              <Button className="ant-dropdown-link">
                                <CaretDownOutlined />
                              </Button>
                            </Dropdown>
                          </TableCell>
                        )}
                      </TableRow>
                    ) : null;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : showFile ? (
            <>
              <File userEmail={userLogin} />
              <button
                style={{ marginTop: "50px", marginLeft: "20px" }}
                className="btn"
                onClick={() => handleActionAdmin("back")}
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
                onClick={() => handleActionAdmin("backDashboard")}
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
                onClick={() => handleActionAdmin("backToDashboard")}
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
                onClick={() => handleActionAdmin("backToMenu")}
              >
                Volver
              </button>
            </>
          ) : null}
          {showUserFiles && selectedUserEmail && (
            <>
              <h4 style={{ margin: "50px" }}>
                Archivos de: {selectedUserName}
              </h4>
              <UserFiles
                userFiles={currentFiles}
                onDeleteFile={handleDeleteFile}
              />
              {currentFiles.length > 0 && (
                <AntdCustomPagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(userFiles.length / filesPerPage)}
                  onNextPage={handleNextPage}
                  onPrevPage={handlePrevPage}
                />
              )}

              <button
                className="btn"
                style={{ margin: "50px" }}
                onClick={() => handleActionAdmin("backToTable")}
              >
                Volver
              </button>
            </>
          )}
          <div>
            {!showFile &&
            !showRegisterBranch &&
            !showUserFiles &&
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
