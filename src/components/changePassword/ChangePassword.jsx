import React, { useState } from "react";
import {
  Input,
  Button,
  Row,
  Col,
} from "antd";
import apiClient from "../../utils/client";
import UsePasswordToggle from "../hooks/UsePasswordToggle";
import { NotificationFailure, NotificationSuccess } from "../notifications/Notifications";
import FormData from "form-data";

export default function PasswordChange({email}) {
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
  });

  const data = new FormData();

  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const resetForm = () => {
    setValues(initialValues);
    setPasswordRequirements({
      minLength: false,
      hasUppercase: false,
      hasNumber: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    data.append("oldPassword", values.oldPassword);
    data.append("newPassword", values.newPassword);
    setLoading(true);

    // Reset errors
    setErrors({});

    // Validate fields
    let newErrors = {};

    if (!values.oldPassword) {
      newErrors.oldPassword = "Contraseña actual requerida";
    }

    if (!values.newPassword) {
      newErrors.newPassword = "Contraseña nueva requerida";
    }

    if (!validatePassword(values.newPassword)) {
      newErrors.newPassword = "Contraseña nueva inválida";
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña requerida";
    }

    if (values.newPassword !== values.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // If there are errors, display them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
        const response = await apiClient.put(`/user/changePsw/${email}`, values);
        console.log(response)
        if (response.data) {
          NotificationSuccess(response.data);
        } else {
          NotificationFailure(response.data);
        }
      
        resetForm();
      } catch (error) {
        console.log(error)
        NotificationFailure(error.response.data.error);
      } finally {
        setLoading(false);
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
    <form style={{maxWidth:"400px", margin:"auto", minHeight:"40vh", marginTop:"50px"}} onSubmit={handleSubmit}>
        <h2>Cambiar contraseña</h2>
      <Row gutter={[16, 16]} className="mb-3">
        <Col span={24}>
          <Input
            placeholder="Contraseña actual"
            name="oldPassword"
            type={PasswordInputType}
            value={values.oldPassword}
            onChange={handleInputChange}
          />
          {errors.oldPassword && (
            <div className="text-danger">{errors.oldPassword}</div>
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mb-3">
        <Col span={24}>
          <Input.Password
            placeholder="Nueva contraseña"
            name="newPassword"
            value={values.newPassword}
            onChange={handlePasswordChange}
          />
          {errors.newPassword && (
            <div className="text-danger">{errors.newPassword}</div>
          )}
          <ul>
            <li className={passwordRequirements.minLength ? "success" : ""}>
              Mínimo de 6 caracteres.
            </li>
            <li className={passwordRequirements.hasUppercase ? "success" : ""}>
              Al menos 1 mayúscula.
            </li>
            <li className={passwordRequirements.hasNumber ? "success" : ""}>
              Al menos 1 número.
            </li>
          </ul>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mb-3">
        <Col span={24}>
          <Input.Password
            placeholder="Confirmar nueva contraseña"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <div className="text-danger">{errors.confirmPassword}</div>
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cambiar Contraseña
          </Button>
        </Col>
      </Row>
    </form>
  );
}
