// original
import React, { useEffect, useState, useRef } from "react";
import {
  getFiles,
  setFilesData,
  setFilesDataLogOut,
} from "../../redux/filesSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import apiClient from "../../utils/client";
import { DownloadIcon } from "../icons/Icons";
import { useNavigate } from "react-router-dom";
import { getUser, setUserData, setLogoutData } from "../../redux/userSlice";
import { clearToken, getToken } from "../../utils/token";
import Loading from "../loading/Loading";
import { FileOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Form } from "antd";
import { Input } from "antd";
import { Select } from "antd";
const { Option } = Select;
import { useFetchKinds } from "../hooks/useFetchKinds";
import { getExtensionIcon } from "../../utils/getExtensionIcon";

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
}

// Función de utilidad para implementar el debounce
// function debounce(func, delay) {
//   let timeoutId;
//   return function (...args) {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func.apply(this, args), delay);
//   };
// }

export const Usuario = () => {
  const initialValues = {
    nombreEmpresa: "",
    nombreEstablecimiento: "",
    cuit: "",
    telefono: "",
    provincia: "",
    ciudad: "",
    email: "",
    direccion: "",
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState(null);
  const [sessionActive, setSessionActive] = useState(true);

  // Estado local para almacenar el tipo seleccionado para el filtro
  const [selectedKind, setSelectedKind] = useState(null);

  const kinds = useFetchKinds();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const user = useAppSelector(getUser);
  const selectedBranchId = useAppSelector((state) => state.user.selectedBranch);

  const token = getToken();

  const files = useAppSelector(getFiles);

  const { Content, Sider } = Layout;

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
  //   ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
  //     document.addEventListener(eventName, handleActivity);
  //   });

  //   // Agregar el listener para el evento beforeunload
  //   window.addEventListener("beforeunload", handleLogout);

  //   // Limpiar los eventos al desmontar el componente
  //   return () => {
  //     clearTimeout(inactivityTimer);
  //     // Remover los eventos para el temporizador de inactividad
  //     ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
  //       document.removeEventListener(eventName, handleActivity);
  //     });
  //     // Reiniciar la referencia para que el mensaje pueda mostrarse nuevamente
  //     inactivityMessageShownRef.current = false;
  //     // Remover el listener al desmontar el componente
  //     window.removeEventListener("beforeunload", handleLogout);
  //   };
  // }, []);

    // Referencia para controlar si el mensaje de inactividad ya se ha mostrado
    const inactivityMessageShownRef = useRef(false);

    // const isRefreshing = useRef(false)
    

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
  
    // // Función para reiniciar el temporizador de inactividad con debounce
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
    //   const debouncedActivityHandler = debounce(handleActivity, 1000); // Tiempo de debounce en milisegundos
    //   ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
    //     document.addEventListener(eventName, debouncedActivityHandler);
    //   });
  
    //   // Agregar el listener para el evento beforeunload
    //   window.addEventListener("beforeunload", handleLogout);
  
    //   // Limpiar los eventos al desmontar el componente
    //   return () => {
    //     clearTimeout(inactivityTimer);
    //     // Remover los eventos para el temporizador de inactividad
    //     ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
    //       document.removeEventListener(eventName, debouncedActivityHandler);
    //     });
    //     // Reiniciar la referencia para que el mensaje pueda mostrarse nuevamente
    //     inactivityMessageShownRef.current = false;
    //     // Remover el listener al desmontar el componente
    //     window.removeEventListener("beforeunload", handleLogout);
    //   };
    // }, []);

 

 
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

  // // Función para reiniciar el temporizador de inactividad con debounce
  // const resetInactivityTimer = () => {
  //   clearTimeout(inactivityTimer);
  //   inactivityTimer = setTimeout(handleLogout, 3600000); // 1 hora en milisegundos
  // };

  // // Función para manejar el evento beforeunload y unload
  // const handleUnload = () => {
  //   // Cerrar sesión solo si el usuario no cerró intencionalmente la sesión
  //   if (!localStorage.getItem("userClosed")) {
  //     handleLogout();
  //   }
  //   // Guardar los datos relevantes en el Local Storage para mantener la sesión
  //   const userData = JSON.stringify(user);
  //   localStorage.setItem("user", userData);
  // };

  // // Agregar el listener para el evento beforeunload y el temporizador de inactividad
  // useEffect(() => {
  //   let inactivityTimer = setTimeout(handleLogout, 3600000); // 1 hora en milisegundos

  //   const handleActivity = () => {
  //     resetInactivityTimer();
  //   };

  //   // Agregar los eventos para el temporizador de inactividad con debounce
  //   const debouncedActivityHandler = debounce(handleActivity, 1000); // Tiempo de debounce en milisegundos
  //   ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
  //     document.addEventListener(eventName, debouncedActivityHandler);
  //   });

  //   // Agregar los eventos para unload y beforeunload
  //   window.addEventListener("unload", handleUnload);
  //   window.addEventListener("beforeunload", handleUnload);

  //   // Limpiar los eventos al desmontar el componente
  //   return () => {
  //     clearTimeout(inactivityTimer);
  //     // Remover los eventos para el temporizador de inactividad
  //     ["load", "click", "keydown", "mousemove"].forEach((eventName) => {
  //       document.removeEventListener(eventName, debouncedActivityHandler);
  //     });
  //     // Remover los eventos para unload y beforeunload
  //     window.removeEventListener("unload", handleUnload);
  //     window.removeEventListener("beforeunload", handleUnload);
  //     // Reiniciar la referencia para que el mensaje pueda mostrarse nuevamente
  //     inactivityMessageShownRef.current = false;
  //   };
  // }, []);

  // // Utilizar useEffect para manejar la recarga de la página
  // useEffect(() => {
  //   // Recuperar los datos almacenados en el Local Storage al cargar la página
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     const userObj = JSON.parse(userData);
  //     dispatch(setUserData(userObj));
  //   }
  //   // Eliminar la marca de que el usuario se cerró intencionalmente al recargar la página
  //   localStorage.removeItem("userClosed");
  // }, []);




  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token && user) {
          const { email } = user;
          const { data } = await apiClient.get(`/user/${email}`);
          if (data) {
            const user = {
              email: data.email,
              nombreEmpresa: data.nombreEmpresa,
              cuit: data.cuit,
              userId: data.userId,
              authToken: data.authToken,
              isAdmin: data.isAdmin,
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

  // prueba
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        if (user && selectedBranchId) {
          setLoading(true);
          const response = await apiClient.get(
            `/branch/${selectedBranchId.branchId}`
          );
          setBranchData(response.data);
          dispatch(setFilesData(response.data.files));
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        NotificationFailure(error.response.data.message);
      }
    };
    fetchBranchData();
  }, [user, selectedBranchId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // const handleDownload = async (id, name) => {
  //   try {
  //     const downloadUrl = `http://localhost:3001/file/${id}`;
  //     const response = await fetch(downloadUrl);
  //     const blob = await response.blob();

  //     // Crear un enlace temporal para descargar el archivo
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = name;
  //     link.click();

  //     // Liberar los recursos del enlace temporal
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     NotificationFailure(error.message);
  //   }
  // };

  const handleDownload = async (id, name) => {
    try {
      const response = await apiClient.get(`/file/${id}`, { responseType: 'blob' });
  
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
  
      // Liberar los recursos del enlace temporal
      window.URL.revokeObjectURL(url);
    } catch (error) {
      NotificationFailure(error.message);
    }
  };

  const signOff = async () => {
    try {
      const res = await apiClient.post("/user/logout");
      dispatch(setLogoutData());
      dispatch(setFilesDataLogOut());
      clearToken();
      setSessionActive(false);
      navigate("/");
      NotificationSuccess(res.data.message);
    } catch (error) {
      NotificationFailure(response.data.error);
    }
  };

  const items = [
    // ...otros ítems existentes...
    getItem("Perfil", "1", <UserOutlined />),
    getItem("Archivos", "2", <FileOutlined />),
    getItem("Salir", "3", <LogoutOutlined />, undefined, signOff),
  ];

  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleKindFilterChange = (value) => {
    // Establecer el tipo seleccionado para el filtro
    setSelectedKind(value);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onSelect={({ key }) => handleMenuItemClick(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          {selectedMenuItem === "1" && (
            <>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                }}
              >
                <Form
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 10 }}
                  layout="horizontal"
                  style={{ maxWidth: 1000 }}
                >
                  <div>
                    <Form.Item
                      label="Nombre de la empresa"
                      htmlFor="nombreEmpresa"
                    >
                      <Input
                        style={{ cursor: "default" }}
                        type="text"
                        id="nombreEmpresa"
                        name="nombreEmpresa"
                        value={user.nombreEmpresa}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Nombre del establecimiento"
                      htmlFor="nombreEstablecimiento"
                    >
                      <Input
                        style={{ cursor: "default" }}
                        type="text"
                        id="nombreEstablecimiento"
                        name="nombreEstablecimiento"
                        value={selectedBranchId.nombreSede}
                      />
                    </Form.Item>
                    <Form.Item label="Ciudad" htmlFor="ciudad">
                      <Input
                        style={{ cursor: "default" }}
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={selectedBranchId.ciudad}
                      />
                    </Form.Item>
                    <Form.Item label="Dirección" htmlFor="direccion">
                      <Input
                        style={{ cursor: "default" }}
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={selectedBranchId.direccion}
                      />
                    </Form.Item>
                    <Form.Item label="Teléfono" htmlFor="telefono">
                      <Input
                        style={{ cursor: "default" }}
                        type="number"
                        id="telefono"
                        name="telefono"
                        value={selectedBranchId.telefono}
                      />
                    </Form.Item>

                    <Form.Item label="CUIT" htmlFor="cuit">
                      <Input
                        style={{ cursor: "default" }}
                        type="number"
                        id="cuit"
                        name="cuit"
                        value={user.cuit}
                      />
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedMenuItem === "2" && (
              <div>
                <h3>Archivos:</h3>
                <div>
                  <Form.Item label="Filtrar por tipo" htmlFor="kind">
                    <Select
                      onChange={(value) => handleKindFilterChange(value)}
                      value={selectedKind}
                      style={{ maxWidth: "400px" }}
                      placeholder="Tipo de archivos"
                    >
                      <Option value="">Todos</Option>
                      {kinds.map((kind) => (
                        <Option key={kind.id} value={kind.id}>
                          {kind.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <label>Filtrar por tipo:</label> */}
                </div>
                {Array.isArray(files.files) && files.files.length === 0 ? (
                  <h4>No tiene archivos cargados actualmente.</h4>
                ) : (
                  files?.files
                    ?.filter(
                      (file) =>
                        !selectedKind || file.kindId === parseInt(selectedKind)
                    )
                    .map((file) => (
                      <div key={file.id}>
                        {getExtensionIcon(file.name)}
                        <a
                          href="#"
                          style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "#51666C",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(file.id, file.name);
                          }}
                        >
                          {file.name}
                        </a>
                        <span
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                          onClick={() => handleDownload(file.id, file.name)}
                        >
                          <DownloadIcon />
                        </span>
                      </div>
                    ))
                )}
                {selectedKind &&
                  Array.isArray(files.files) &&
                  files.files.filter(
                    (file) => file.kindId === parseInt(selectedKind)
                  ).length === 0 && (
                    <span>No hay archivos para este tipo.</span>
                  )}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
