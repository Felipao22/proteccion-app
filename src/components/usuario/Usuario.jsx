import React, { useEffect, useState } from "react";
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
import { DeleteIcon, DownloadIcon } from "../icons/Icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getUser, setUserData, setLogoutData } from "../../redux/userSlice";
import { clearToken, getToken } from "../../utils/token";
import FormData from 'form-data';
import { useFetchCities } from "../hooks/useFetchCities";
// import { useFetchUsers } from "../hooks/useFetchUser";
import Loading from '../loading/Loading'
import { FileOutlined, UserOutlined, LogoutOutlined, FolderOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useFetchKinds } from "../hooks/useFetchKinds";
import { Form } from "antd";
import { Input } from "antd";
import { Select } from "antd";


function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick
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
    direccion: ''
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [loading, setLoading] = useState(true)


  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const user = useAppSelector(getUser);

  const token = getToken();

  const files = useAppSelector(getFiles);



const { Content, Sider } = Layout;


  const VALIDATE_CUIT = /^[0-9]{11}$/;



      useEffect(() => {
        const fetchUserData = async () => {
          try {
            if (token && user) {
              const { email } = user;
              const { data } = await apiClient.get(`/user/${email}`);
              // const res = await apiClient.get(`user/${email}/branch`);
              if (data) {
                const user = {
                  email: data.email,
                  nombreEmpresa: data.nombreEmpresa,
                  nombreEstablecimiento: data.nombreEstablecimiento,
                  cuit: data.cuit,
                  telefono: data.telefono,
                  provincia: data.provincia,
                  ciudad: data.ciudad,
                  userId: data.userId,
                  authToken: data.authToken,
                  direccion: data.direccion,
                  isAdmin: data.isAdmin
                };
                // dispatch(setFilesData(res.data.branches));
                dispatch(setUserData(user));
                setLoading(false)
              }
            }
          } catch (error) {
            NotificationFailure(error.response.data.message);
          }
        };
        fetchUserData();
      }, [token, user, dispatch]);


  

const handleUserData = async (e) => {
  e.preventDefault();

  // Valida los campos modificados
  let newErrors = {};
  if (values.cuit && !VALIDATE_CUIT.test(values.cuit)) {
    newErrors.cuit = "Deben ser 11 números";
  }

  if (values.telefono && (values.telefono.length < 10 || values.telefono.length > 11)) {
    newErrors.telefono = "Número de teléfono inválido";
  }

  // Si hay errores, los muestra
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    if (user && token) {
      const { email } = user;

      // Crea un objeto con los valores modificados no vacíos
        const updatedValues = {
      email: values.email !== "" ? values.email : user.email,
      nombreEmpresa:
        values.nombreEmpresa !== "" ? values.nombreEmpresa : user.nombreEmpresa,
      nombreEstablecimiento:
        values.nombreEstablecimiento !== ""
          ? values.nombreEstablecimiento
          : user.nombreEstablecimiento,
      cuit: values.cuit !== "" ? values.cuit : user.cuit,
      telefono: values.telefono !== "" ? values.telefono : user.telefono,
      provincia: values.provincia !== "" ? values.provincia : user.provincia,
      ciudad: values.ciudad !== "" ? values.ciudad : user.ciudad,
      direccion: values.direccion !== "" ? values.direccion : user.direccion
    };

      if (Object.keys(updatedValues).length === 0) {
        NotificationFailure("No se han realizado modificaciones");
        return;
      }

      const res = await apiClient.put(`/user/${email}`, updatedValues);
      dispatch(setUserData(res.data.modification));
      NotificationSuccess(res.data.message);
    }
  } catch (error) {
    NotificationFailure(error.response.data.message);
  }
};


  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };


  const handleDownload = async (id, name) => {
    try {
      const downloadUrl = `http://localhost:3001/file/${id}`;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
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
      navigate("/");
      NotificationSuccess(res.data.message);
    } catch (error) {
      NotificationFailure(response.data.error);
    }
  };

  // const deleteFile = async (id) => {
  //   try {
  //     const result = await Swal.fire({
  //       title: "¿Está seguro que desea eliminar el archivo?",
  //       text: "¡No podrá revertir esto!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Sí, eliminar",
  //       cancelButtonText: "Cancelar",
  //     });

  //     if (result.isConfirmed) {
  //       await apiClient.delete(`file/${id}`);
  //       dispatch(setFilesData());
  //       NotificationSuccess("Archivo eliminado");
  //     }
  //   } catch (error) {
  //     if (
  //       error.response &&
  //       error.response.data &&
  //       error.response.data.message
  //     ) {
  //       NotificationFailure(error.response.data.message);
  //     } else {
  //       NotificationFailure("Error al eliminar el archivo");
  //     }
  //   }
  // };

 




  //prueba
  // const ProvinceSelect = () => {
  //   return (
  //     <>
  //       <Select.Option disabled value="">Seleccione una provincia</Select.Option>
  //       {selectedProvince?.map((province) => (
  //         <Select.Option key={province.id} value={province.nombre}>{province.nombre}</Select.Option>
  //       ))}
  //     </>
  //   );
  // };

  // original 
  // const CitySelect = () => {
  //   const selectedProvinceId = selectedProvince?.find(province => province.nombre === values.provincia)?.id;
  //   const filteredCities = selectedCities?.filter(city => city.provinceId === selectedProvinceId);
  
  //   return (
  //     <>
  //       <select disabled value="">Seleccione una ciudad</select>
  //       {
  //       filteredCities?.map(city => (
  //         <option key={city.id} value={city.nombre}>{city.nombre}</option>
  //       ))}
  //     </>
  //   );
  // };

  // const CitySelect = ({ selectedCity }) => {
  //   const selectedProvinceId = selectedProvince?.find(
  //     (province) => province.nombre === values.provincia
  //   )?.id;
  //   const filteredCities = selectedCities?.filter(
  //     (city) => city.provinceId === selectedProvinceId
  //   );
  
  //   return (
  //     <>
  //       <option disabled value="">
  //         Seleccione una ciudad
  //       </option>
  //       {filteredCities?.map((city) => (
  //         <option
  //           key={city.id}
  //           value={city.nombre}
  //           selected={city.nombre === selectedCity} // Set the selected attribute
  //         >
  //           {city.nombre}
  //         </option>
  //       ))}
  //     </>
  //   );
  // };

  // const selectedCity = user.ciudad;.

  // const CitySelect = ({ selectedCity }) => {
  //   const selectedProvinceId = selectedProvince?.find(
  //     (province) => province.nombre === values.provincia
  //   )?.id;
  //   const filteredCities = selectedCities?.filter(
  //     (city) => city.provinceId === selectedProvinceId
  //   );
  
  //   return (
  //     <>
  //       <option disabled value="">
  //         Seleccione una ciudad
  //       </option>
  //       {filteredCities?.map((city) => (
  //         <option
  //           key={city.id}
  //           value={city.nombre}
  //           selected={city.nombre === selectedCity}
  //         >
  //           {city.nombre}
  //         </option>
  //       ))}
  //     </>
  //   );
  // };
  // const selectedCity = user.ciudad;





  const items = [
    // ...otros ítems existentes...
    getItem('Perfil', '1', <UserOutlined />),
    getItem('Archivos', '2', <FileOutlined />),
    getItem('Salir', '3', <LogoutOutlined />, undefined, signOff)
  ];
  
  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
  };

    const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
<Layout style={{ minHeight: '100vh' }}>
  <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
    <div className="logo-vertical" />
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onSelect={({ key }) => handleMenuItemClick(key)} />
  </Sider>
  <Layout>
    <Content style={{ margin: '0 16px' }}>
      {selectedMenuItem === '1' && (
        <>
          {user && user.nombreEmpresa !== null ? (
            <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
              {/* <h3>Empresa: {user.nombreEmpresa || "-"}</h3>
              <h3>Cuit: {user.cuit || "-"}</h3>
              <h3>Provincia: {user.provincia || "-"}</h3>
              <h3>Ciudad: {user.ciudad || "-"}</h3>
              <h3>Teléfono: {user.telefono || "-"}</h3>
              <h3>Establecimiento: {user.nombreEstablecimiento || "-"}</h3>
              <h3>Dirección: {user.direccion || "-"}</h3>
              <h3>Email: {user.email}</h3> */}
              <Form labelCol={{ span: 10 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        style={{ maxWidth: 600 }} onSubmit={handleUserData}>
                <div>
                  <Form.Item label="Nombre de la empresa" htmlFor="nombreEmpresa" >

                  <Input
                    type="text"
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    value={values.nombreEmpresa !== "" ? values.nombreEmpresa : user.nombreEmpresa}
                    onChange={handleInputChange}
                  />
                  </Form.Item>
                  <Form.Item label="Nombre del establecimiento" htmlFor="nombreEstablecimiento">
                  <Input
                    type="text"
                    id="nombreEstablecimiento"
                    name="nombreEstablecimiento"
                    value={values.nombreEstablecimiento !== "" ? values.nombreEstablecimiento : user.nombreEstablecimiento}
                    onChange={handleInputChange}
                  />

                  </Form.Item>
                  <Form.Item label="Dirección" htmlFor="direccion">
                  <Input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={values.direccion !== "" ? values.direccion : user.direccion}
                    onChange={handleInputChange}
                  />
                  </Form.Item>
                  {/* <Form.Ttem label="Modificar provincia" htmlFor="provincia">
                  <Select.Option
                    id="provincia"
                    name="provincia"
                    value={values.provincia !== "" ? values.provincia : user.provincia}
                    onChange={handleInputChange}
                  >
                    {ProvinceSelect()}
                  </Select.Option>
                  
                  </Form.Ttem> */}
                  {/* <Form.Item label="Modificar provincia" htmlFor="provincia">
  <Select
    id="provincia"
    name="provincia"
    value={values.provincia !== "" ? values.provincia : user.provincia}
    onChange={handleInputChange}
  >
    {ProvinceSelect()}
  </Select>
</Form.Item> */}
                  {/* <label htmlFor="ciudad">Modificar ciudad</label>
                  <select
                    id="ciudad"
                    name="ciudad"
                    value={values.ciudad !== "" ? user.ciudad : values.ciudad}
                    onChange={handleInputChange}
                  >
                    {CitySelect()}
                  </select> */}
                  {/* <select
  id="ciudad"
  name="ciudad"
  value={values.ciudad !== "" ? values.ciudad : user.ciudad}
  onChange={handleInputChange}
>
  <CitySelect selectedCity={selectedCity} />
</select>
*/}
                  <Form.Item label="Modificar teléfono" htmlFor="telefono">
                  <Input
                    type="number"
                    id="telefono"
                    name="telefono"
                    value={values.telefono !== "" ? values.telefono : user.telefono}
                    onChange={handleInputChange}
                  />
                  </Form.Item>
                  
                  {errors.telefono && (
                    <span style={{ color: "red", display: "flex", justifyContent: "center" }}>
                      {errors.telefono}
                    </span>
                  )}
                  <Form.Item label="Modificar CUIT" htmlFor="cuit">

                  <Input
                    type="number"
                    id="cuit"
                    name="cuit"
                    value={values.cuit !== "" ? values.cuit : user.cuit}
                    onChange={handleInputChange}
                  />
                  </Form.Item>
                  {errors.cuit && (
                    <span style={{ color: "red", display: "flex", justifyContent: "center" }}>
                      {errors.cuit}
                    </span>
                  )}
                </div>
               <button type="submit">Guardar cambios</button>
              </Form>
            </div>
          ) : (
            <div>
              <p>Tienes que cargar la información de la empresa.</p>
              <form onSubmit={handleUserData}>
                <div>
                  <label label="Empresa" htmlFor="nombreEmpresa">Empresa
                    </label>
                  
                  <input
                    type="text"
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    value={values.nombreEmpresa}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="nombreEstablecimiento"> Nombre del establecimiento</label>
                  <input
                    type="text"
                    id="nombreEstablecimiento"
                    name="nombreEstablecimiento"
                    value={values.nombreEstablecimiento}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={values.direccion}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="provincia">Provincia</label>
                  {/* <select
                    id="provincia"
                    name="provincia"
                    value={values.provincia}
                    onChange={handleInputChange}
                  >
                    {ProvinceSelect()}
                  </select> */}
                  <label htmlFor="ciudad">Ciudad</label>
                  {/* <select
                    id="ciudad"
                    name="ciudad"
                    value={values.ciudad}
                    onChange={handleInputChange}
                  >
                    {CitySelect()}
                  </select> */}
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="number"
                    id="telefono"
                    name="telefono"
                    value={values.telefono}
                    onChange={handleInputChange}
                  />
                  {errors.telefono && (
                    <span style={{ color: "red", display: "flex", justifyContent: "center" }}>
                      {errors.telefono}
                    </span>
                  )}
                  <label htmlFor="cuit">CUIT</label>
                  <input
                    type="number"
                    id="cuit"
                    name="cuit"
                    value={values.cuit}
                    onChange={handleInputChange}
                  />
                  {errors.cuit && (
                    <span style={{ color: "red", display: "flex", justifyContent: "center" }}>
                      {errors.cuit}
                    </span>
                  )}
                </div>
                <button type="submit">Guardar</button>
              </form>
            </div>
          )}
        </>
      )}
      {selectedMenuItem === '2' && (
  <div>
    <h3>Archivos:</h3>
    {Array.isArray(files.files) && files.files.length === 0 ? (
      <h4>No tiene archivos cargados actualmente.</h4>
    ) : (
      files.files.map((file) => (
        <div key={file.id}>
          <a
            href={`http://localhost:3001/file/${file.id}`}
            style={{ cursor: "pointer" }}
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
  </div>
)}


{/* prueba */}
{/* {selectedMenuItem === '2' && (
  <div>
    <h3>Archivos:</h3>
    {(!files.branches || files.branches.length === 0) ? (
      <h4>No tiene archivos cargados actualmente.</h4>
      
    ) : (
      files.branches.map((branch) => (
        <div key={branch.branchId}>
          <h4>{branch.nombreSede}</h4>
          {(!branch.files || branch.files.length === 0) ? (
            <h4>No tiene archivos cargados actualmente en esta sucursal.</h4>
          ) : (
            branch.files.map((file) => (
              <div key={file.id}>
                <a
                  href={`http://localhost:3001/file/${file.id}`}
                  style={{ cursor: "pointer" }}
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
        </div>
      ))
    )}
  </div>
)} */}

    </Content>
    <div>
    </div>
  </Layout>
</Layout>


  );
  
};
