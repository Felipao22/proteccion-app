import React, { useState } from "react";
import "./Register.css";
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
import { useNavigate } from "react-router-dom";
import UsePasswordToggle from "../hooks/UsePasswordToggle";

export default function Register() {
  const initialValues = {
    nombreEmpresa: "",
    email: "",
    password: "",
    confirmPassword: "",
    cuit: "",
  };
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
  });

  const [loading, setLoading] = useState(false);

  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();

  const data = new FormData();

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateEmail = (email) => {
    // Utiliza una expresión regular para verificar si el email es válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password)

  }

  const VALIDATE_CUIT = /^[0-9]{11}$/;

  const resetForm = () => {
    setValues(initialValues);
    setPasswordRequirements({
      minLength: false,
      hasUppercase: false,
      hasNumber: false,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    data.append("nombreEmpresa", values.nombreEmpresa);
    data.append("email", values.email);
    data.append("password", values.password);
    data.append("cuit", values.cuit);

    // Reinicia los errores
    setErrors({});

    // Valida los campos
    let newErrors = {};

    if (!values.nombreEmpresa) {
      newErrors.nombreEmpresa = "Nombre de Empresa requerido";
    }

    if (!values.cuit) {
      newErrors.cuit = "Cuit requerido";
    }
    if (values.cuit && !VALIDATE_CUIT.test(values.cuit)) {
      newErrors.cuit = "Deben ser 11 números";
    }

    if (!values.email) {
      newErrors.email = "Email requerido";
    }
    if (!validateEmail(values.email)) {
      newErrors.email = "Email inválido";
    }
    if (!values.password) {
      newErrors.password = "Contraseña requerida";
    }

    if(!validatePassword(values.password)) {
      newErrors.password = "Contraseña inválida"
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña";
    }
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Si hay errores, los muestra
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await apiClient.post("/user", values);
      NotificationWarning(res.data.warning);
      if (res.data.created) {
        NotificationSuccess(res.data.message);
      }
      resetForm();
    } catch (error) {
      NotificationFailure(error.response.data.message);
    } finally {
      setLoading(false)
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const requirements = {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
    };
    setPasswordRequirements(requirements);
    handleInputChange(e);
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
                Registrar Empresa
              </p>
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="user" size="lg" />
                  </div>
                  <MDBInput
                    name="nombreEmpresa"
                    value={values.nombreEmpresa}
                    label="Empresa"
                    id="form1"
                    type="text"
                    className="w-100"
                    onChange={handleInputChange}
                  />
                </div>
                {errors.nombreEmpresa && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {errors.nombreEmpresa}
                  </span>
                )}
                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="user" size="lg" />
                  </div>
                  <MDBInput
                    name="cuit"
                    value={values.cuit}
                    label="Cuit"
                    id="form2"
                    type="number"
                    className="w-100"
                    onChange={handleInputChange}
                  />
                </div>
                {errors.cuit && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {errors.cuit}
                  </span>
                )}
                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    {/* <MDBIcon
                      fas
                      icon="envelope"
                      size="lg"
                      style={{ marginTop: "5px" }}
                    /> */}
                    <MDBIcon fas icon="user" size="lg" />
                  </div>
                  <MDBInput
                    type="email"
                    name="email"
                    value={values.email}
                    placeholder="mail@example.com"
                    onChange={handleInputChange}
                    label="Email"
                    id="form3"
                  />
                </div>
                {errors.email && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {errors.email}
                  </span>
                )}

                <div className="d-flex flex-row align-items-center mb-4 input-text">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="lock" size="lg" />
                  </div>
                  <MDBInput
                    label="Contraseña"
                    id="form4"
                    type={PasswordInputType}
                    name="password"
                    placeholder="Contraseña"
                    autoComplete="off"
                    value={values.password}
                    onChange={handlePasswordChange}
                  />
                  {/* <i className="eye-icon">{ToggleIcon}</i> */}
                </div>
                <ul>
                  <li
                    className={passwordRequirements.minLength ? "success" : ""}
                  >
                    Mínimo de 6 caracteres
                  </li>
                  <li
                    className={
                      passwordRequirements.hasUppercase ? "success" : ""
                    }
                  >
                    Al menos 1 mayúscula
                  </li>
                  <li
                    className={passwordRequirements.hasNumber ? "success" : ""}
                  >
                    Al menos 1 número
                  </li>
                </ul>
                {errors.password && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {errors.password}
                  </span>
                )}

                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="key" size="lg" />
                  </div>
                  <MDBInput
                    label="Confirmar contraseña"
                    id="form5"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    autoComplete="off"
                    value={values.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.confirmPassword && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {errors.confirmPassword}
                  </span>
                )}
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
