import React, { useState } from "react";
import { MDBContainer, MDBCol, MDBRow, MDBCheckbox } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./Login.css";
import { Form } from "react-bootstrap";
import UsePasswordToggle from "../hooks/UsePasswordToggle";
import log from "../../assets/authentication.png";
import apiClient from "../../utils/client";
import { useAppDispatch } from "../../redux/hooks";
import { setToken } from "../../utils/token";
import {
  NotificationFailure,
  NotificationSuccess,
  NotificationWarning,
} from "../notifications/Notifications";
import { useNavigate } from "react-router-dom";
import { setLoginData } from "../../redux/userSlice";
import { Button, Modal } from "antd";

export default function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     setDebouncedEmail(values.email);
  //   }, 1000);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [values.email]);

  // useEffect(() => {
  //   const fetchBranches = async () => {
  //     try {
  //       // Si el usuario es un administrador, no hacemos el fetch
  //       if (isAdmin) {
  //         return;
  //       }

  //       else if (debouncedEmail) {
  //         setLoading(true);
  //         const res = await apiClient.get(`/user/${debouncedEmail}/branch`);
  //         setBranches(res.data.branches);
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching branches:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchBranches();
  // }, [debouncedEmail, isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateEmail = (email) => {
    // Utiliza una expresión regular para verificar si el email es válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      email: values.email,
      password: values.password,
    };

    // Valida los campos
    let newErrors = {};
    if (!values.email) {
      newErrors.email = "Email requerido";
    }
    if (!validateEmail(values.email)) {
      newErrors.email = "Email inválido";
    }
    if (!values.password) {
      newErrors.password = "Contraseña requerida";
    }

    // Si hay errores, los muestra
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await apiClient.post("/user/login", data);
      dispatch(
        setLoginData({
          userId: res.data.user.userId,
          authToken: res.data.token,
          email: res.data.user.email,
          isAdmin: res.data.user.isAdmin,
          isSuperAdmin: res.data.user.isSuperAdmin,
        })
      );
      setToken(res.data.token);
      NotificationSuccess(res.data.message);
      NotificationWarning(res.data.warning);

      // If the user is an admin, navigate to the dashboard directly
      if (res.data.user.isAdmin) {
        return navigate("/dashboard");
      }

      navigate(`/usuario`);
    } catch (error) {
      // Si hay un error específico de "Usuario no encontrado" (status 404)
      if (error.response && error.response.status === 404) {
        // Mostrar mensaje de error para usuario no encontrado
        NotificationFailure(error.response.data.error);
      } else if (error.response && error.response.status === 401) {
        // Si el status es 401, entonces la contraseña es incorrecta
        NotificationFailure(error.response.data.error);
      } else {
        // Otros errores, mostrar un mensaje genérico de error
        NotificationFailure("Ocurrió un error al ingresar al sistema");
      }
    }
  };


  const handleResetPassword = async () => {
    if (!resetPasswordEmail || !validateEmail(resetPasswordEmail)) {
      NotificationFailure("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    try {
      const response = await apiClient.post("/user/forgot-password", {
        email: resetPasswordEmail,
      });
      setShowResetPasswordModal(false);
      NotificationSuccess(response.data);
    } catch (error) {
      NotificationFailure(
        "Ocurrió un error al enviar el correo de restablecimiento."
      );
    }
  };

  const handleForgotPasswordClick = () => {
    setShowResetPasswordModal(true);
  };

  return (
    <div>
      <Form onSubmit={handleLogin}>
        <MDBContainer fluid className="p-3 my-5">
          <MDBRow>
            <MDBCol col="10" md="6">
              <img
                src={log}
                className="img-fluid"
                alt="Phone"
                style={{ marginTop: "-40px" }}
              />
            </MDBCol>

            <MDBCol col="4" md="6">
              <div className="input-text">
                <input
                  className="input-email"
                  type="email"
                  placeholder="Ingrese su mail"
                  name="email"
                  value={values.email}
                  id="email"
                  onChange={handleInputChange}
                />
                <i className="fa fa-envelope"></i>
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
              <div className="input-text">
                <input
                  className="input-password"
                  type={PasswordInputType}
                  placeholder="Ingrese su contraseña"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <i className="fa fa-lock"></i>
                <i className="eye">{ToggleIcon}</i>
              </div>
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

              <div className="d-flex justify-content-between mx-4 mb-4 mt-4 label-font">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPasswordClick();
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button type="submit" className="boton-login" size="lg">
                Ingresar
              </button>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Form>

      <Modal
        title="Restablecer contraseña"
        open={showResetPasswordModal}
        onCancel={() => setShowResetPasswordModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowResetPasswordModal(false)}>
            Cancelar
          </Button>,
          <Button key="reset" type="primary" onClick={handleResetPassword}>
            Enviar correo
          </Button>,
        ]}
      >
        <p>
          Por favor, ingrese su dirección de correo electrónico para restablecer
          su contraseña.
        </p>
        <Form.Control
          type="email"
          placeholder="Correo electrónico"
          value={resetPasswordEmail}
          autoComplete="on"
          onChange={(e) => setResetPasswordEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
}
