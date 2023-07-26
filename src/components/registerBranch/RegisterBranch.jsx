import React, { useState } from "react";
// import "./Register.css";
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

  const selectedCities = useFetchCities();
  const selectedUser = useFetchUsers();

  const data = new FormData();

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
      console.log(res);
      NotificationWarning(res.data.warning);
      if (res.data.newUserBranch) {
        NotificationSuccess(res.data.message);
      }
      resetForm();
    } catch (error) {
      NotificationFailure(error.response.data.message);
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
        <select disabled value="">
          {" "}
          Selecciona la empresa
        </select>
        {selectedUser?.map((user) => (
          <option key={user.userId} value={user.email}>
            {user.nombreEmpresa}
          </option>
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
                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon
                      fas
                      icon="envelope"
                      size="lg"
                      style={{ marginTop: "5px" }}
                    />
                  </div>
                  <select
                    name="userEmail"
                    value={values.userEmail}
                    onChange={handleInputChange}
                  >
                    {UserSelect()}
                  </select>
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

                <div className="d-flex flex-row align-items-center mb-4 input-text">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="lock" size="lg" />
                  </div>
                  <select
                    id="ciudad"
                    name="ciudad"
                    value={values.ciudad}
                    onChange={handleInputChange}
                  >
                    {CitySelect()}
                  </select>
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
