import React, { useEffect, useState } from "react";
import apiClient from "../../utils/client";
import Swal from "sweetalert2";
import { File } from "../file/File";
import Loading from "../loading/Loading";
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
import RegisterEmployee from "../registerEmployee/RegisterEmployee";
import ChangePassword from "../changePassword/ChangePassword";
import EmployeeList from "../employeeList/EmployeeList";
import { Table, Space } from "antd";
import {
  CaretDownOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  FileOutlined,
  LogoutOutlined,
  MinusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { AddKind } from "../addKind/AddKind";
import EditBranch from "../editBranch/EditBranch";

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
  const [showEmployeesList, setShowEmployeesList] = useState(false);
  const [showAddKind, setShowAddKind] = useState(false);
  const [editBranchEmail, setEditBranchEmail] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [originalBranchData, setOriginalBranchData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = getToken();

  const user = useAppSelector(getUser);

  const branch = useAppSelector(getUser).selectedBranch;

  const fetchAndSetBusinessData = async () => {
    try {
      const res = await apiClient.get("/user");
      setSelectedUser(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAndSetBusinessData();
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
          searchRegex.test(row.cuit) ||
          searchRegex.test(row.telefono) ||
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
        NotificationFailure(error.response.data.message);
      } else {
        NotificationFailure("Error al bloquear el usuario");
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
        NotificationFailure(error.response.data.message);
      } else {
        NotificationFailure("Error al activar el usuario");
      }
    }
  };

  const loadBranchFiles = async (email) => {
    try {
      const response = await apiClient.get(`/user/${email}/files`);
      setUserFiles(response.data);
      setShowUserFiles(true);
    } catch (error) {
      NotificationFailure(error);
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
        NotificationFailure(error.response.data.message);
      } else {
        NotificationFailure("Error al eliminar el Establecimiento/Obra");
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
    listEmployees: () => setShowEmployeesList(true),
    backToDashboard: () => setShowRegisterEmployee(false),
    changePassword: () => setShowChangePassword(true),
    backToMenu: () => setShowChangePassword(false),
    branchFiles: () => setShowUserFiles(true),
    backToTable: () => setShowUserFiles(false),
    backTo: () => setShowEmployeesList(false),
    addKind: () => setShowAddKind(true),
    backAgain: () => setShowAddKind(false),
    backdashboard: () => setShowEditForm(false),
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
      {isSuperAdminUser() && (
        <Menu.Item key="5" onClick={() => handleActionAdmin("listEmployees")}>
          Empleados
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="6" onClick={() => handleActionAdmin("addKind")}>
          Agregar tipo de archivo
        </Menu.Item>
      )}
    </Menu>
  );

  const acciones = (email) => (
    <Menu>
      {isSuperAdminUser() && (
        <Menu.Item key="1" onClick={() => handleAction("bloquear", email)}>
          <LockOutlined /> Bloquear
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="2" onClick={() => handleAction("activar", email)}>
          <UnlockOutlined /> Activar
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="3" onClick={() => handleAction("archivos", email)}>
          <FileOutlined /> Archivos
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item key="4" onClick={() => handleAction("editar", email)}>
          <EditOutlined /> Editar
        </Menu.Item>
      )}
      {isSuperAdminUser() && (
        <Menu.Item
          key="5"
          danger
          onClick={() => handleAction("eliminar", email)}
        >
          <DeleteOutlined /> Eliminar
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
        case "editar":
          openEditForm(email);
          break;
        case "eliminar":
          deleteBranch(email);
          break;
        default:
          break;
      }
    }
  };

  const columns = [
    {
      title: isSuperAdminUser() ? "Acciones" : null,
      key: "acciones",
      render: (record) => (
        <Space size="middle">
          {isSuperAdminUser() && (
            <Dropdown
              overlay={() => acciones(record.email)}
              placement="bottomLeft"
            >
              <Button>
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          )}
        </Space>
      ),
      responsive: ["xs"],
    },
    {
      title: "Empresa",
      dataIndex: "nombreEmpresa",
      key: "nombreEmpresa",
    },
    {
      title: "Establecimiento/Obra",
      dataIndex: "nombreSede",
      key: "nombreSede",
    },
    {
      title: "Email Empresa",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "Email Jefe",
      dataIndex: "emailJefe",
      key: "emailJefe",
      render: (text) =>
        text ? (
          <a href={`mailto:${text}`}>{text}</a>
        ) : (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <MinusOutlined />
          </span>
        ),
    },
    {
      title: "Emails",
      dataIndex: "emails",
      key: "emails",
      render: (emails) =>
        emails && emails.length > 0 ? (
          <span>
            {emails.map((email, index) => (
              <span key={index}>
                <a href={`mailto:${email}`}>{email}</a>
                {index < emails.length - 1 && ", "}
              </span>
            ))}
          </span>
        ) : (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <MinusOutlined />
          </span>
        ),
    },
    {
      title: "Cuit",
      dataIndex: "cuit",
      key: "cuit",
      render: (text) =>
        text || (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <MinusOutlined />
          </span>
        ),
    },
    {
      title: "Ciudad",
      dataIndex: "ciudad",
      key: "ciudad",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      render: (text) =>
        text || (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <MinusOutlined />
          </span>
        ),
    },
    {
      title: "Registrado",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        formatDate(date) || (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <MinusOutlined />
          </span>
        ),
    },
    {
      title: isSuperAdminUser() ? "Acciones" : null,
      key: "acciones",
      render: (record) => (
        <Space size="middle">
          {isSuperAdminUser() && (
            <Dropdown
              overlay={() => acciones(record.email)}
              placement="bottomLeft"
            >
              <Button>
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          )}
        </Space>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
  ];

  const userLogin = user.email;

  const openEditForm = async (email) => {
    try {
      setEditBranchEmail(email);
      setShowEditForm(true);
      const response = await apiClient.get(`/user/${email}`);
      setOriginalBranchData(response.data);
    } catch (error) {
      NotificationFailure(error);
    }
  };

  return (
    <div>
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
          !showEmployeesList &&
          !showAddKind &&
          !showEditForm &&
          !showChangePassword ? (
            <div>
              <Dropdown overlay={menu} className="actions-dropdown">
                <Button
                  style={{ margin: "10px" }}
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Acciones <CaretDownOutlined />
                </Button>
              </Dropdown>

              <Input
                style={{ margin: "40px", maxWidth: "200px" }}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar"
              />

              <Table
                style={{
                  marginRight: "10px",
                  marginLeft: "10px",
                  marginTop: "30px",
                }}
                columns={columns}
                dataSource={searchUsers(selectedUser)
                  .map((row) => {
                    const userAccessEmails = row.accessUser?.flat();
                    const isUserEmailMatch =
                      user?.email === row.email ||
                      userAccessEmails?.includes(user?.email);
                    const shouldRenderRow =
                      (isUserEmailMatch && !isSuperAdminUser()) ||
                      isSuperAdminUser();

                    return shouldRenderRow ? row : null;
                  })
                  .filter((row) => row !== null)}
                rowKey="userId"
                pagination={{
                  pageSize: 10,
                  size: "small",
                }}
                scroll={{ x: true }}
                rowClassName={(record) =>
                  record?.active === false ? "blocked-row" : ""
                }
              />
            </div>
          ) : showFile ? (
            <>
              <File userEmail={userLogin} />
              <Button
                style={{ marginTop: "50px", marginLeft: "20px" }}
                type="primary"
                onClick={() => handleActionAdmin("back")}
              >
                Volver
              </Button>
            </>
          ) : showRegisterBranch ? (
            <div className="background-image">
              <RegisterBranch />
              <Button
                style={{ margin: "50px" }}
                type="primary"
                onClick={() => handleActionAdmin("backDashboard")}
              >
                Volver
              </Button>
            </div>
          ) : showEmployeesList ? (
            <>
                <h4 style={{ margin: "50px" }}>Empleados/as:</h4>
              <EmployeeList />
              <Button
                style={{ margin: "50px" }}
                type="primary"
                onClick={() => handleActionAdmin("backTo")}
              >
                Volver
              </Button>
            </>
          ) : showRegisterEmployee ? (
            <>
              <RegisterEmployee />
              <Button
                style={{ margin: "50px" }}
                type="primary"
                onClick={() => handleActionAdmin("backToDashboard")}
              >
                Volver
              </Button>
            </>
          ) : showChangePassword ? (
            <>
              <ChangePassword email={user.email} />
              <Button
                style={{ margin: "50px" }}
                type="primary"
                onClick={() => handleActionAdmin("backToMenu")}
              >
                Volver
              </Button>
            </>
          ) : showAddKind ? (
            <>
              <AddKind />
              <Button
                style={{ margin: "50px" }}
                type="primary"
                onClick={() => handleActionAdmin("backAgain")}
              >
                Volver
              </Button>
            </>
          ) : null}
          {showEditForm && editBranchEmail && (
            <>
              <EditBranch
                email={editBranchEmail}
                onCancel={() => setOriginalBranchData(originalBranchData)}
                fetchAndSetBusinessData={fetchAndSetBusinessData}
                originalBranchData={originalBranchData}
              />
              <Button
                type="primary"
                style={{ marginLeft: "50px", marginBottom: "20px" }}
                onClick={() => handleActionAdmin("backdashboard")}
              >
                Volver
              </Button>
            </>
          )}

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

              <Button
                type="primary"
                style={{ margin: "50px" }}
                onClick={() => handleActionAdmin("backToTable")}
              >
                Volver
              </Button>
            </>
          )}

          <div>
            {!showFile &&
            !showRegisterBranch &&
            !showUserFiles &&
            !showEmployeesList &&
            !showAddKind &&
            !showChangePassword &&
            !showEditForm &&
            !showRegisterEmployee ? (
              <button className="boton-logout" onClick={signOff}>
                <LogoutOutlined className="icon-logout" /> Cerrar sesión
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
