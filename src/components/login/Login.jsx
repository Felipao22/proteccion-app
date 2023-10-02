import React, { useState } from "react";
import "./Login.css";
import UsePasswordToggle from "../hooks/UsePasswordToggle";
import log from "../../assets/authentication.png";
import apiClient from "../../utils/client";
import { useAppDispatch } from "../../redux/hooks";
// import { setToken } from "../../utils/token";
import {
  NotificationFailure,
  NotificationSuccess,
  NotificationWarning,
} from "../notifications/Notifications";
import { useNavigate } from "react-router-dom";
import { setLoginData } from "../../redux/userSlice";
import { Button, Col, Modal, Row, Form, Input } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { setToken } from "../../utils/cookieUtils";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
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
      // setToken(res.data.token);
      setToken('token', res.data.token)
      NotificationSuccess(res.data.message);
      NotificationWarning(res.data.warning);

      if (res.data.user.isAdmin) {
        return navigate("/dashboard");
      }

      navigate(`/usuario`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        NotificationFailure(error.response.data.error);
      } else if (error.response && error.response.status === 401) {
        NotificationFailure(error.response.data.error);
      } else {
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
      <Form onFinish={handleLogin}>
        <div style={{ padding: "1rem" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <img src={log} className="img-fluid" alt="Imagen login" />
            </Col>
            <Col className="col-login" xs={24} sm={12} md={12} lg={12} xl={12}>
              <div className="input-text">
                <Input
                  className="input-email"
                  prefix={<MailOutlined style={{ fontSize: '16px' }}/>}
                  type="email"
                  placeholder="Ingrese su mail"
                  name="email"
                  value={values.email}
                  id="email"
                  onChange={handleInputChange}
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
              <div className="input-text">
                <Input.Password
                  className="input-password"
                  prefix={<LockOutlined style={{ fontSize: '16px' }}/>}
                  placeholder="Ingrese su contraseña"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
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
              <Button
                type="primary"
                htmlType="submit"
                className="boton-login"
                size="medium"
              >
                Ingresar
              </Button>
            </Col>
          </Row>
        </div>
      </Form>

      <Modal
        title="Restablecer contraseña"
        visible={showResetPasswordModal}
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
        <Input
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
