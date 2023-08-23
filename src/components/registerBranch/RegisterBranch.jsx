import React, { useState } from "react";
import {
  NotificationFailure,
  NotificationSuccess,
  NotificationWarning,
} from "../notifications/Notifications";
import FormData from "form-data";
import apiClient from "../../utils/client";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useFetchCities } from "../hooks/useFetchCities";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { Form, Select } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { setSelectedBranch } from "../../redux/userSlice";

export default function Register() {
  const initialValues = {
    nombreSede: "",
    userEmail: "",
    ciudad: "",
    direccion: "",
    telefono: "",
  };
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const selectedCities = useFetchCities();
  const selectedUser = useFetchUsers();

  const data = new FormData();

  const dispatch = useAppDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateEmail = (userEmail) => {
    // Utiliza una expresión regular para verificar si el email es válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(userEmail);
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    data.append("nombreSede", values.nombreSede);
    data.append("userEmail", values.userEmail);
    data.append("ciudad", values.ciudad);
    data.append("direccion", values.direccion);
    data.append("telefono", values.telefono);

    // Reinicia los errores
    setErrors({});

    // Valida los campos
    let newErrors = {};

    if (!values.nombreSede) {
      newErrors.nombreSede = "Nombre de Establecimiento/Obra requerido";
    }

    if (!values.userEmail) {
      newErrors.userEmail = "Empresa requerida";
    }
    if (!values.ciudad) {
      newErrors.ciudad = "Ciudad requerida";
    }

    if (!values.direccion) {
      newErrors.direccion = "Direccion requerida";
    }
    if (!values.telefono) {
      newErrors.telefono = "Teléfono requerido";
    }

    // Si hay errores, los muestra
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await apiClient.post("/branch", values);
      NotificationWarning(res.data.warning);
      if (res.data.newUserBranch) {
        NotificationSuccess(res.data.message);
        dispatch(setSelectedBranch(res.data.newUserBranch));
      }
      resetForm();
    } catch (error) {
      NotificationFailure(error.response.data.message);
    } finally {
      setLoading(false)
    }
  };

  const CitySelect = () => {
    return (
      <>
        <select disabled value="">
          Seleccione una ciudad
        </select>
        {selectedCities?.map((city) => (
          <option key={city.id} value={city.nombre}>
            {city.nombre}
          </option>
        ))}
      </>
    );
  };

  const UserSelect = () => {
    return (
      <>
        <Select disabled value="">
          {" "}
          Selecciona la empresa
        </Select>
        {selectedUser?.map((user) => (
          <Option key={user.userId} value={user.email}>
            {user.nombreEmpresa}
          </Option>
        ))}
      </>
    );
  };

  return (
    <MDBContainer fluid>
      <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol
              md="10"
              lg="6"
              className="order-2 order-lg-1 d-flex flex-column align-items-center"
            >
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                Registrar Establecimiento/Obra
              </p>
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="user" size="lg" />
                  </div>
                  <MDBInput
                    name="nombreSede"
                    value={values.nombreSede}
                    label="Establecimiento/Obra"
                    id="form1"
                    type="text"
                    className="w-100"
                    onChange={handleInputChange}
                  />
                </div>
                {errors.nombreSede && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {errors.nombreSede}
                  </span>
                )}
                <div>
                  {/* <div style={{ width: "40px", marginRight: "10px" }}>
                      <MDBIcon
                        fas
                        icon="envelope"
                        size="lg"
                        style={{ marginTop: "5px" }}
                      />
                    </div> */}
                  <Form.Item htmlFor="nombreEmpresa">
                    <Select
                      name="userEmail"
                      onChange={(value) =>
                        handleInputChange({
                          target: { name: "userEmail", value },
                        })
                      }
                      value={values.userEmail}
                      style={{ maxWidth: "210px", marginLeft: "44px" }} // Ajusta los valores de width y height según tus necesidades.
                      // placeholder="Empresas"
                    >
                      <Select.Option disabled value="">
                        Empresas
                      </Select.Option>
                      {selectedUser
                        ?.filter((user) => !user.isAdmin)
                        .map((user) => (
                          <Select.Option key={user.userId} value={user.email}>
                            {user.nombreEmpresa}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  {/* <select
                      name="userEmail"
                      value={values.userEmail}
                      onChange={handleInputChange}
                    >
                      {UserSelect()}
                    </select> */}
                  {/* <MDBInput
                      type="email"
                      name="userEmail"
                      value={values.userEmail}
                      placeholder="mail@example.com"
                      onChange={handleInputChange}
                      label="Email"
                      id="form2"
                    /> */}
                </div>
                {errors.userEmail && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {errors.userEmail}
                  </span>
                )}

                <div>
                  {/* <div style={{ width: "40px", marginRight: "10px" }}>
                      <MDBIcon fas icon="lock" size="lg" />
                    </div> */}
                  <Form.Item htmlFor="ciudad">
                    <Select
                      onChange={(value) =>
                        handleInputChange({
                          target: { name: "ciudad", value },
                        })
                      }
                      value={values.ciudad}
                      style={{ maxWidth: "210px", marginLeft: "44px" }}
                      placeholder="Ciudades"
                    >
                      <Select.Option disabled value="">
                        Ciudades
                      </Select.Option>
                      {selectedCities?.map((city) => (
                        <Select.Option key={city.id} value={city.nombre}>
                          {city.nombre}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <select
                      id="ciudad"
                      name="ciudad"
                      value={values.ciudad}
                      onChange={handleInputChange}
                    >
                      {CitySelect()}
                    </select> */}
                  {errors.ciudad && (
                    <span
                      style={{
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {errors.ciudad}
                    </span>
                  )}
                  {/* <i className="eye-icon">{ToggleIcon}</i> */}
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="key" size="lg" />
                  </div>
                  <MDBInput
                    label="Teléfono"
                    id="form4"
                    type="number"
                    name="telefono"
                    placeholder="2664897896"
                    value={values.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.telefono && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {errors.telefono}
                  </span>
                )}

                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="key" size="lg" />
                  </div>
                  <MDBInput
                    label="Dirección"
                    id="form4"
                    type="text"
                    name="direccion"
                    placeholder="2664897896"
                    value={values.direccion}
                    onChange={handleInputChange}
                  />
                </div>
                {loading && (
              <div className="text-center my-4">
                <MDBIcon icon="spinner" spin size="3x" />
                <div>Registrando empresa...</div>
              </div>
            )}

                <button type="submit" className="boton-register" size="lg">
                  Registrar
                </button>
              </form>
            </MDBCol>

            <MDBCol
              md="10"
              lg="6"
              className="order-1 order-lg-2 d-flex align-items-center"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                fluid
              />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
