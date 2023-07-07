import React, { useState, useEffect } from "react";
import bgImg from "../../assets/img1.jpg";
import Swal from "sweetalert2";
import "./Register.css";
import { NotificationFailure, NotificationSuccess, NotificationWarning} from "../notifications/Notifications"
import FormData from 'form-data';
import apiClient from "../../utils/client";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import UsePasswordToggle from "../hooks/UsePasswordToggle";
// import NavBar from "../navbar/NavBar";

export default function Register() {

const initialValues = {
  email: "",
  password: "",
  confirmPassword: ""
}
const [values, setValues] = useState(initialValues);
const [errors, setErrors] = useState({});
const [passwordRequirements, setPasswordRequirements] = useState({
  minLength: false,
  hasUppercase: false,
  hasNumber: false
});

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

  const resetForm = () => {
    setValues(initialValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    data.append('email', values.email);
    data.append('password', values.password);

    // Reinicia los errores
    setErrors({});

    // Valida los campos
    let newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;



    if(!values.email){
      newErrors.email = "Email requerido";
    }
    if (!validateEmail(values.email)) {
      newErrors.email = "Email inválido";
    }
    if (!values.password) {
      newErrors.password = "Contraseña requerida";
    }

    if(!values.confirmPassword){
      newErrors.confirmPassword = "Confirmar contraseña"
    }
    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
//         // Verifica los requisitos de la contraseña
// const password = values.password;
// const requirements = {
//   minLength: password.length >= 8,
//   hasUppercase: /[A-Z]/.test(password),
//   hasNumber: /\d/.test(password)
// };
// setPasswordRequirements(requirements);

    // Si hay errores, los muestra
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await apiClient.post('/user', values);
      NotificationWarning(res.data.warning);
      if (res.data.created) {
        NotificationSuccess(res.data.message);
        navigate("/login")
      }
      resetForm();
    } catch (error) {
      NotificationFailure(error.response.data.message);
    }
  };

// const handleRegister = async () => {
//   data.append('email', formData.email);
//   data.append('password', formData.password);
//   const {password, confirmPassword, email} = initialValues
//   if (password !== confirmPassword) {
//     NotificationFailure('Las contraseñas no coinciden');
//   } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)){
//     NotificationFailure('El email no es válido')
//   }else{
//     try {
//       const res = await apiClient.post('/signup', data);
//       NotificationSuccess(res.data.message);
//     } catch (error) {
//       NotificationFailure(error.response.data.message);
//     }
//   }
// };

const handlePasswordChange = (e) => {
  const password = e.target.value;
  const requirements = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password)
  };
  setPasswordRequirements(requirements);
  handleInputChange(e); // Si necesitas manejar otros cambios en el campo de contraseña
};

 

  return (

    <MDBContainer fluid>
    <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
      <MDBCardBody>
        <MDBRow>
          <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registrarse</p>
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-row align-items-center mb-4">
                <div style={{ width: '40px', marginRight: '10px' }}>
                  <MDBIcon fas icon="user" size='lg' />
                </div>
                <MDBInput label='Empresa' id='form1' type='text' className='w-100' />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <div style={{ width: '40px', marginRight: '10px' }}>
                  <MDBIcon fas icon="envelope" size='lg' style={{ marginTop: '5px' }} />
                </div>
                <MDBInput
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="mail@example.com"
                  onChange={handleInputChange}
                  label='Email'
                  id='form2'
                />
              </div>
              {errors.email && <span style={{ color: "red", display: 'flex', justifyContent: 'center' }}>{errors.email}</span>}

              <div className="d-flex flex-row align-items-center mb-4 input-text">
                <div style={{ width: '40px', marginRight: '10px' }}>
                  <MDBIcon fas icon="lock" size='lg' />
                </div>
                <MDBInput
                  label='Contraseña'
                  id='form3'
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
                <li className={passwordRequirements.minLength ? 'success' : ''}>
                  Mínimo de 6 caracteres
                </li>
                <li className={passwordRequirements.hasUppercase ? 'success' : ''}>
                  Al menos 1 mayúscula
                </li>
                <li className={passwordRequirements.hasNumber ? 'success' : ''}>
                  Al menos 1 número
                </li>
              </ul>
              {errors.password && <span style={{ color: "red", display: 'flex', justifyContent: 'center' }}>{errors.password}</span>}

              <div className="d-flex flex-row align-items-center mb-4">
                <div style={{ width: '40px', marginRight: '10px' }}>
                  <MDBIcon fas icon="key" size='lg' />
                </div>
                <MDBInput
                  label='Confirmar contraseña'
                  id='form4'
                  type='password'
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  autoComplete="off"
                  value={values.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              {errors.confirmPassword && <span style={{ color: "red", display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>{errors.confirmPassword}</span>}

              <button type="submit" className="boton-register" size="lg">
                Registrarse
              </button>
            </form>
          </MDBCol>

          <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  </MDBContainer>

  //   <MDBContainer fluid>
  //   <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
  //     <MDBCardBody>
  //       <MDBRow>
  //         <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
  //           <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registrarse</p>
  //           <form onSubmit={handleSubmit}>
  //             <div className="d-flex flex-row align-items-center mb-4">
  //               <MDBIcon fas icon="user me-3" size='lg' />
  //               <MDBInput label='Empresa' id='form1' type='text' className='w-100' />
  //             </div>

  //             <div className="d-flex flex-row align-items-center mb-4">
  //               <MDBIcon fas icon="envelope me-3" size='lg' />
  //               <MDBInput
  //                 type="email"
  //                 name="email"
  //                 value={values.email}
  //                 placeholder="mail@example.com"
  //                 onChange={handleInputChange}
  //                 label='Email'
  //                 id='form2'
  //               />
  //             </div>
  //             {errors.email && <span style={{ color: "red", display: 'flex', justifyContent: 'center' }}>{errors.email}</span>}

  //             <div className="d-flex flex-row align-items-center mb-4 input-text">
  //               <MDBIcon fas icon="lock me-3" size='lg' />
  //               <MDBInput
  //                 label='Contraseña'
  //                 id='form3'
  //                 type={PasswordInputType}
  //                 name="password"
  //                 placeholder="Contraseña"
  //                 autoComplete="off"
  //                 value={values.password}
  //                 onChange={handlePasswordChange}
  //               />
  //               {/* <i className="eye-icon">{ToggleIcon}</i> */}
  //             </div>
  //             <ul>
  //               <li className={passwordRequirements.minLength ? 'success' : ''}>
  //                 Mínimo de 6 caracteres
  //               </li>
  //               <li className={passwordRequirements.hasUppercase ? 'success' : ''}>
  //                 Al menos 1 mayúscula
  //               </li>
  //               <li className={passwordRequirements.hasNumber ? 'success' : ''}>
  //                 Al menos 1 número
  //               </li>
  //             </ul>
  //             {errors.password && <span style={{ color: "red", display: 'flex', justifyContent: 'center' }}>{errors.password}</span>}

  //             <div className="d-flex flex-row align-items-center mb-4">
  //               <MDBIcon fas icon="key me-3" size='lg' />
  //               <MDBInput
  //                 label='Confirmar contraseña'
  //                 id='form4'
  //                 type='password'
  //                 name="confirmPassword"
  //                 placeholder="Confirmar contraseña"
  //                 autoComplete="off"
  //                 value={values.confirmPassword}
  //                 onChange={handleInputChange}
  //               />
  //             </div>
  //             {errors.confirmPassword && <span style={{ color: "red", display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>{errors.confirmPassword}</span>}

  //             <button type="submit" className="boton-register" size="lg">
  //               Registrarse
  //             </button>
  //           </form>
  //         </MDBCol>

  //         <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
  //           <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
  //         </MDBCol>
  //       </MDBRow>
  //     </MDBCardBody>
  //   </MDBCard>
  // </MDBContainer>


    // el que funciona
//     <MDBContainer fluid>

//       <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
//         <MDBCardBody>
//           <MDBRow>
//             <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

//               <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registrarse</p>
//               <form onSubmit={handleSubmit}>
//               <div className="d-flex flex-row align-items-center mb-4 ">
//                 <MDBIcon fas icon="user me-3" size='lg'/>
//                 <MDBInput label='Empresa' id='form1' type='text' className='w-100'/>
//               </div>

//               <div className="d-flex flex-row align-items-center mb-4">
//                 <MDBIcon fas icon="envelope me-3" size='lg'/>
//                 <MDBInput type="email"
//           name="email"
//           value={values.email}
//           placeholder="mail@example.com"
//           onChange={handleInputChange}  label='Email' id='form2'/>
//               </div>
//                 {errors.email && <span style={{color:"red",display:'flex', justifyContent:'center',}}>{errors.email}</span>}

//               <div className="d-flex flex-row align-items-center mb-4 input-text">
//                 <MDBIcon fas icon="lock me-3" size='lg'/>
//                 <MDBInput label='Contraseña' id='form3' type={PasswordInputType}
//           name="password"
//           placeholder="Contraseña"
//           autoComplete="off"
//           value={values.password}
//           onChange={handlePasswordChange}/>
//                 <i className="eye">{ToggleIcon}</i>
//               </div>
//               <ul>
//   <li className={passwordRequirements.minLength ? 'success' : ''}>
//     Mínimo de 6 carácteres
//   </li>
//   <li className={passwordRequirements.hasUppercase ? 'success' : ''}>
//     Al menos 1 mayúscula
//   </li>
//   <li className={passwordRequirements.hasNumber ? 'success' : ''}>
//     Al menos 1 número
//   </li>
// </ul>

//           {errors.password && <span style={{color:"red",display:'flex', justifyContent:'center',}}>{errors.password}</span>}

//               <div className="d-flex flex-row align-items-center mb-4">
//                 <MDBIcon fas icon="key me-3" size='lg'/>
//                 <MDBInput label='Confirmar contraseña' id='form4' type='password'
//           name="confirmPassword"
//           placeholder="Confirmar contraseña"
//           autoComplete="off"
//           value={values.confirmPassword}
//           onChange={handleInputChange}/>
//               </div>
//           {errors.confirmPassword && <span style={{color:"red", display:'flex', justifyContent:'center', marginBottom:'20px'}}>{errors.confirmPassword}</span>}


//               {/* <MDBBtn className='mb-4'  size='lg'>Registrarse</MDBBtn> */}
//               <button type="submit" className="boton-register" size="lg">
//                 Registrarse
//               </button>
//               </form>

//             </MDBCol>

//             <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
//               <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
//             </MDBCol>

//           </MDBRow>
//         </MDBCardBody>
//       </MDBCard>

//     </MDBContainer>
    // <section>
    //   <div className="register">
    //     <div className="col-1">
    //       <h2>Registrarse</h2>
    //       <form
    //         id="form"
    //         className="flex flex-col"
    //         onSubmit={handleSubmit}
    //       >
    //   <div>
    //   <label htmlFor="mail">Ingrese su correo electrónico:</label>
    //     <input
    //       type="email"
    //       name="email"
    //       value={values.email}
    //       placeholder="mail@example.com"
    //       onChange={handleInputChange}
    //     />
    //     {errors.email && <span style={{color:"red"}}>{errors.email}</span>}
    //   </div>
    //   <div>
    //   <label htmlFor="password">Ingrese su contraseña:</label>
    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Contraseña"
    //       autoComplete="off"
    //       value={values.password}
    //       onChange={handleInputChange}
    //     />
    //     {errors.password && <span style={{color:"red"}}>{errors.password}</span>}
    //   </div>
    //   <div>
    //   <label htmlFor="confirmpwd">Confirme su contraseña:</label>
    //     <input
    //       type="password"
    //       name="confirmPassword"
    //       placeholder="Confirmar contraseña"
    //       autoComplete="off"
    //       value={values.confirmPassword}
    //       onChange={handleInputChange}
    //     />
    //     {errors.confirmPassword && <span style={{color:"red"}}>{errors.confirmPassword}</span>}
    //   </div>
    //   <button type="submit" className="boton-register">Registrarse</button>
    // </form>
    //     </div>
    //     <div className="col-2">
    //       <img src={bgImg} alt="" />
    //     </div>
    //   </div>
    // </section>
  );
}


// function App() {
//   return (
//     <MDBContainer fluid>

//       <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
//         <MDBCardBody>
//           <MDBRow>
//             <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

//               <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registrarse</p>
//               <form onSubmit={handleSubmit}>
//               <div className="d-flex flex-row align-items-center mb-4 ">
//                 <MDBIcon fas icon="user me-3" size='lg'/>
//                 <MDBInput label='Empresa' id='form1' type='text' className='w-100'/>
//               </div>

//               <div className="d-flex flex-row align-items-center mb-4">
//                 <MDBIcon fas icon="envelope me-3" size='lg'/>
//                 <MDBInput type="email"
//           name="email"
//           value={values.email}
//           placeholder="mail@example.com"
//           onChange={handleInputChange}  label='Email' id='form2'/>
//                 {errors.email && <span style={{color:"red"}}>{errors.email}</span>}
//               </div>

//               <div className="d-flex flex-row align-items-center mb-4">
//                 <MDBIcon fas icon="lock me-3" size='lg'/>
//                 <MDBInput label='Contraseña' id='form3' type='password'
//           name="password"
//           placeholder="Contraseña"
//           autoComplete="off"
//           value={values.password}
//           onChange={handleInputChange}/>
//           {errors.password && <span style={{color:"red"}}>{errors.password}</span>}
//               </div>

//               <div className="d-flex flex-row align-items-center mb-4">
//                 <MDBIcon fas icon="key me-3" size='lg'/>
//                 <MDBInput label='Confirmar contraseña' id='form4' type='confirmPassword'
//           name="confirmPassword"
//           placeholder="Confirmar contraseña"
//           autoComplete="off"
//           value={values.confirmPassword}
//           onChange={handleInputChange}/>
//           {errors.confirmPassword && <span style={{color:"red"}}>{errors.confirmPassword}</span>}
//               </div>


//               <MDBBtn className='mb-4' size='lg'>Registrarse</MDBBtn>
//               </form>

//             </MDBCol>

//             <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
//               <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
//             </MDBCol>

//           </MDBRow>
//         </MDBCardBody>
//       </MDBCard>

//     </MDBContainer>
//   );
// }
