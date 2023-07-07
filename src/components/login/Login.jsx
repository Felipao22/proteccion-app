import React, { useState, useEffect } from "react";
import { MDBContainer, MDBCol, MDBRow, MDBCheckbox } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./Login.css";
import { Form } from "react-bootstrap";
import UsePasswordToggle from "../hooks/UsePasswordToggle";
import log from '../../assets/authentication.png'
import FormData from 'form-data';
import apiClient from "../../utils/client";
import { useAppDispatch } from '../../redux/hooks'
import { setToken } from "../../utils/token";
import { NotificationFailure, NotificationSuccess, NotificationWarning } from "../notifications/Notifications";
import { useNavigate } from "react-router-dom";
import { setLoginData } from '../../redux/userSlice'

export default function Login() {
  const initialValues = {
    email: "",
    password: "",
  }
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();

  const data = new FormData();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  const validateEmail = (email) => {
    // Utiliza una expresión regular para verificar si el email es válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // resetForm();
    const data = {
      email: values.email,
      password: values.password
    };
    // Valida los campos
    let newErrors = {};
    if(!values.email){
      newErrors.email = "Email requerido";
    }
    if (!validateEmail(values.email)) {
      newErrors.email = "Email inválido";
    }
    if(!values.password){
      newErrors.password = "Contraseña requerida";
    }

    // Si hay errores, los muestra
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const res = await apiClient.post('/user/login', data);


        dispatch(
          setLoginData({
            userId: res.data.userLogin.userId,
            authToken: res.data.token,
            email:res.data.userLogin.email
          })
        );
        setToken(res.data.token);
        NotificationSuccess(res.data.message);
      NotificationWarning(res.data.warning)
      if(res.data.userLogin.isAdmin){
        return navigate('/dashboard')
      }
      navigate(`/usuario`);
    } catch (error) {
      NotificationFailure(error.response.data.message);
    }
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
                style={{marginTop:'-40px'}}
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
              {errors.email && <span style={{color:"red",display:'flex', justifyContent:'center',}}>{errors.email}</span>}
              <div className="input-text">
                <input
                  className="input-password"
                  type={PasswordInputType}
                  placeholder="Ingrese su contraseña"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleInputChange}
                  autoComplete='off'
                />
                <i className="fa fa-lock"></i>
                <i className="eye">{ToggleIcon}</i>
              </div>
              {errors.password && <span style={{color:"red",display:'flex', justifyContent:'center',}}>{errors.password}</span>}

              <div className="d-flex justify-content-between mx-4 mb-4 mt-4 label-font">
                <MDBCheckbox
                  name="flexCheck"
                  value=""
                  id="flexCheckDefault"
                  label="Recordar"
                />
                <a href="!#">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="boton-login" size="lg">
                Ingresar
              </button>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Form>
    </div>
  );
}
