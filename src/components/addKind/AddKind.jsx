import { useState } from "react";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import apiClient from "../../utils/client";
import { useId } from "react";
import { Form, Input, Button, Tooltip } from "antd";
import "./AddKind.css";
import { InfoCircleOutlined } from "@ant-design/icons";

export const AddKind = () => {
  const initialValues = {
    name: "",
  };

  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const id = useId();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    validateField(name, value);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitDisabled(true);
  };

  const validateUpperCase = (name) => {
    const regex = /^[A-Z]/;
    return regex.test(name);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "name") {
      if (!value) {
        newErrors.name = "Nombre requerido";
      } else if (!validateUpperCase(value)) {
        newErrors.name = "Primera letra debe ser mayúscula";
      } else {
        delete newErrors.name;
      }
    }

    setErrors(newErrors);
    setIsSubmitDisabled(Object.keys(newErrors).length > 0);
  };

  const handleLoadKind = async () => {
    setLoading(true);
    // Reinicia los errores
    setErrors({});

    // Valida los campos
    validateField("name", values.name);

    // Si hay errores, los muestra y no realiza la acción de carga
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post("/kind", values);
      NotificationSuccess(res.data.message);
      resetForm();
    } catch (error) {
      console.error("Error al agregar el tipo de archivo:", error);
      NotificationFailure(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="kind">
      <label htmlFor={id}>Nombre del tipo de archivo:</label>
      <Form.Item htmlFor={id}>
        <Input
          placeholder="Ej: Iluminación"
          name="name"
          value={values.name}
          onChange={handleInputChange}
        />
      </Form.Item>
      {errors.name && (
        <span
          style={{
            color: "red",
            display: "flex",
            justifyContent: "center",
            marginBottom:"10px",
            marginTop:"-20px",
          }}
        >
          <Tooltip title={errors.name}>
            <InfoCircleOutlined style={{ marginRight: "4px" }} />
          </Tooltip>
          {errors.name}
        </span>
      )}
      <Button
        loading={loading}
        type="primary"
        style={{ marginRight: "10px" }}
        onClick={handleLoadKind}
        disabled={isSubmitDisabled}
      >
        Agregar
      </Button>
      <Button onClick={resetForm}>Cancelar</Button>
    </div>
  );
};
