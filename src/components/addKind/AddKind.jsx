import { useState } from "react";
// import FormData from "form-data";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import apiClient from "../../utils/client";
import { useId } from "react";
import { Form, Input, Button } from "antd";
import "./AddKind.css"

export const AddKind = () => {
  const initialValues = {
    name: "",
  };

  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const id = useId();

//   const data = new FormData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  const handleLoadKind = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post("/kind", values);
      NotificationSuccess(res.data.message);
      resetForm();
    } catch (error) {
      console.error('Error al agregar el tipo de archivo:', error);
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
        <Button type="primary" style={{ marginRight: '10px' }} onClick={handleLoadKind}>
          Agregar
        </Button>
        <Button onClick={resetForm}>Cancelar</Button>
      </div>
  );
};
