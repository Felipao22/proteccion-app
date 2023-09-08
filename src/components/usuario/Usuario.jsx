// original
import React, { useEffect, useState, useRef } from "react";
import {
  getFiles,
  setFilesData,
  setFilesDataLogOut,
  setSelectedDate,
  setSelectedKind,
} from "../../redux/filesSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import apiClient from "../../utils/client";
import { DownloadIcon } from "../icons/Icons";
import { useNavigate } from "react-router-dom";
import { getUser, setUserData, setLogoutData, setSelectedBranch } from "../../redux/userSlice";
import { clearToken, getToken } from "../../utils/token";
import Loading from "../loading/Loading";
import { FileOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Form } from "antd";
import { Input } from "antd";
import { Select } from "antd";
const { Option } = Select;
import { DatePicker } from "antd";
import { useFetchKinds } from "../hooks/useFetchKinds";
import { getExtensionIcon } from "../../utils/getExtensionIcon";
import moment from "moment";
import AntdCustomPagination from "../Pagination/Pagination";

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
}

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
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState(null);
  const [sessionActive, setSessionActive] = useState(true);

  const kinds = useFetchKinds();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const user = useAppSelector(getUser);


  const token = getToken();

  const files = useAppSelector(getFiles);

  const selectedKind = useAppSelector((state) => state.files.selectedKind);
  const selectedDate = useAppSelector((state) => state.files.selectedDate);

  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;

  const { Content, Sider } = Layout;

  const allFiles = files?.files || [];

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
              nombreSede: data.nombreSede,
              ciudad: data.ciudad,
              direccion: data.direccion,
              telefono: data.telefono,
              userId: data.userId,
              authToken: data.authToken,
              isAdmin: data.isAdmin,
            };
            dispatch(setUserData(user));
            dispatch(setFilesData(data.files));
            // dispatch(setSelectedBranch(user))
            setLoading(false);
          }
        }
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };
    fetchUserData();
  }, [token, user, dispatch]);

  // useEffect(() => {
  //   const fetchBranchData = async () => {
  //     try {
  //       if (user && selectedBranchId) {
  //         setLoading(true);
  //         const response = await apiClient.get(
  //           `/branch/${selectedBranchId.branchId}`
  //         );
  //         setBranchData(response.data);
  //         dispatch(setFilesData(response.data.files));
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       NotificationFailure(error.response.data.message);
  //     }
  //   };
  //   fetchBranchData();
  // }, [user, selectedBranchId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDownload = async (id, name) => {
    try {
      const response = await apiClient.get(`/file/${id}`, {
        responseType: "blob",
      });

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
    dispatch(setSelectedKind(value)); // Actualiza el estado global en Redux
  };

  const handleDateFilterChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM") : null; // Almacenar la fecha como cadena "YYYY-MM" o null si no hay fecha
    dispatch(setSelectedDate(formattedDate)); // Actualiza el estado global en Redux
  };

  const filteredFiles = allFiles.filter((file) => {
    const fileCreatedAtMoment = moment(file?.createdAt);
    const selectedDateMoment = selectedDate
      ? moment(selectedDate, "YYYY-MM")
      : null;

    return (
      (!selectedKind || file?.kindId === parseInt(selectedKind)) &&
      (!selectedDateMoment ||
        fileCreatedAtMoment.format("MM/YY") ===
          selectedDateMoment.format("MM/YY"))
    );
  });

  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const sortedFiles = currentFiles.slice().toSorted((a, b) => {
    const dateA = moment(a.createdAt);
    const dateB = moment(b.createdAt);
    return dateB - dateA;
  });

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
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
                  maxWidth: 900,
                  margin: "auto",
                  borderRadius: 20,
                  marginTop: "60px"
                }}
              >
                <h3 style={{marginTop:"20px"}}>Mis datos</h3>
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
                        value={user.nombreSede}
                      />
                    </Form.Item>
                    <Form.Item label="Ciudad" htmlFor="ciudad">
                      <Input
                        style={{ cursor: "default" }}
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={user.ciudad}
                      />
                    </Form.Item>
                    <Form.Item label="Dirección" htmlFor="direccion">
                      <Input
                        style={{ cursor: "default" }}
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={user.direccion}
                      />
                    </Form.Item>
                    <Form.Item label="Teléfono" htmlFor="telefono">
                      <Input
                        style={{ cursor: "default" }}
                        type="number"
                        id="telefono"
                        name="telefono"
                        value={user.telefono}
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
                <h3 style={{marginTop:"20px"}}>Archivos</h3>
                <Form.Item label="Filtrar por tipo" htmlFor="kind">
                  <Select
                    onChange={handleKindFilterChange}
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
                <div>
                <Form.Item label="Filtrar por mes" htmlFor="month">
                  <DatePicker
                    picker="month"
                    onChange={handleDateFilterChange}
                    value={
                      selectedDate ? moment(selectedDate, "YYYY-MM") : null
                    }
                    format="MM/YYYY"
                    // locale="es_ES"
                  />
                  </Form.Item>  
                </div>

                {files.length === 0 ? (
                  <h4>No tiene archivos cargados actualmente.</h4>
                ) : (
                  sortedFiles?.map((file) => (
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
                {(selectedKind || selectedDate) &&
                  filteredFiles.length === 0 &&
                  (selectedKind && selectedDate ? (
                    <span>No hay archivos para este tipo y mes.</span>
                  ) : (
                    <>
                      {selectedKind && (
                        <span>No hay archivos para este tipo.</span>
                      )}
                      {selectedDate && (
                        <span>No hay archivos para este mes.</span>
                      )}
                    </>
                  ))}
                 {filteredFiles.length > 0 && (
                <AntdCustomPagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredFiles.length / filesPerPage)}
                  onNextPage={handleNextPage}
                  onPrevPage={handlePrevPage}
                />
              )}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
