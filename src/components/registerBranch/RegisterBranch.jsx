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
import { Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "./RegisterBranch.css";

export default function Register() {
  const initialValues = {
    nombreSede: "",
    userEmail: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    emails: "",
    accessUser: ""
  };
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailFields, setEmailFields] = useState([""]);
  const [emailEmployee, setEmailEmployee] = useState([""]);

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
    setEmailFields([""]);
    setEmailEmployee([""])
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    data.append("nombreSede", values.nombreSede);
    data.append("userEmail", values.userEmail);
    data.append("ciudad", values.ciudad);
    data.append("direccion", values.direccion);
    data.append("telefono", values.telefono);
    data.append("emails", values.emails);
    data.append("accessUser", values.accessUser);

   
    // Reinicia los errores
    setErrors({});

    values.accessUser = emailEmployee;
    // values.accessUser = emailEmployee?.filter(email => email.trim() !== '');

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
    if (!emailFields) {
      newErrors.emails = "Mails requeridos";
    }
    // if (!validateEmail(values.emails)) {
    //   newErrors.emails = "Formato de mail incorrecto";
    // }

    // Si hay errores, los muestra
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Filtrar campos de correo electrónico vacíos
    const nonEmptyEmails = emailFields.filter((email) => email.trim() !== "");
    // values.accessUser = emailEmployee.filter(email => email.trim() !== '');
    // const nonEmptyUserEmails = emailEmployee.filter((e) => e.trim() !== "");

    try {
      const res = await apiClient.post("/branch", {
        ...values,
        emails: nonEmptyEmails,
        // accessUser: nonEmptyUserEmails
      });
      NotificationWarning(res.data.warning);
      if (res.data.newUserBranch) {
        NotificationSuccess(res.data.message);
        dispatch(setSelectedBranch(res.data.newUserBranch));
      }
      resetForm();
    } catch (error) {
      NotificationFailure(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmailField = (e) => {
    e.preventDefault();
    setEmailFields([...emailFields, ""]);
  };

  const handleEmailChange = (index, value) => {
    const updatedFields = [...emailFields];
    updatedFields[index] = value;
    setEmailFields(updatedFields);
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

  const handleRemoveEmailField = (index) => {
    const updatedFields = emailFields.filter((_, i) => i !== index);
    setEmailFields(updatedFields);
  };

  const AdminEmailSelect = () => {
    return (
      <div style={{ marginLeft:"40px"}}>
        {emailEmployee.map((email, index) => (
          <div key={index}>
            <label style={{marginBottom:"10px"}} >Dar acceso a empleados:</label>
            <Form.Item >
              <Select
                value={email}
                onChange={(value) => handleAdminEmailChange(index, value)}
                style={{ maxWidth:"700px" }}
                placeholder="Seleccionar email de empleado"
                mode="multiple"
              >
                {selectedUser
                  ?.filter((user) => user.isAdmin && !user.isSuperAdmin)
                  .map((user) => (
                    <Select.Option key={user.userId} value={user.email}>
                      {user.email}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        ))}
      </div>
    );
  };

  
  // const handleAdminEmailChange = (index, value) => {
  //   const updatedFields = [...emailEmployee];
  //   updatedFields[index] = value;
  //   setEmailEmployee(updatedFields);
  // };

  const handleAdminEmailChange = (index, value) => {
    const updatedFields = [...emailEmployee];
    if (value) {
      updatedFields[index] = value;
    } else {
      // Remove the email if it's cleared
      updatedFields.splice(index, 1);
    }
    setEmailEmployee(updatedFields);
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
              <form>
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
                    // placeholder="2664897896"
                    value={values.direccion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <div style={{ width: "40px", marginRight: "10px" }}>
                    <MDBIcon fas icon="key" size="lg" />
                  </div>
                  <div>
                    {emailFields.map((email, index) => (
                      <>
                        <MDBInput
                          label="Email"
                          key={index}
                          type="email"
                          placeholder="example@mail.com"
                          value={email}
                          onChange={(e) =>
                            handleEmailChange(index, e.target.value)
                          }
                        />
                        <Button
                        type="primary"
                        danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => handleRemoveEmailField(index)}
                          style={{marginTop:"5px"}}
                        >
                          Eliminar
                        </Button>
                      </>
                    ))}
                    <Button
                      icon={<PlusOutlined />}
                      onClick={handleAddEmailField}
                      size="20px"
                    />
                  </div>
                </div>
                {errors.emails && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {errors.emails}
                  </span>
                )}
                <div className="">
  <AdminEmailSelect />
</div>
                {loading && (
                  <div className="text-center my-4">
                    <MDBIcon icon="spinner" spin size="3x" />
                    <div>Registrando empresa...</div>
                  </div>
                )}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="boton-register"
                  size="lg"
                >
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
