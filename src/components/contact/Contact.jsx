// import React from "react";
// import "mdb-react-ui-kit/dist/css/mdb.min.css";
// import "./Contact.css";
// import Footer from "../footer/Footer";
// import {
//   MDBCardHeader,
//   MDBInput,
//   MDBTextArea,
//   MDBTypography,
// } from "mdb-react-ui-kit";
// import emailjs from "@emailjs/browser";
// import Swal from "sweetalert2";
// const { VITE_APP_SERVICE_ID, VITE_APP_TEMPLATE_ID, VITE_APP_PUBLIC_KEY } =
//   import.meta.env;

// export default function Contact() {
//   function sendEmail(e) {
//     e.preventDefault();

//     emailjs
//       .sendForm(
//         `${VITE_APP_SERVICE_ID}`,
//         `${VITE_APP_TEMPLATE_ID}`,
//         e.target,
//         `${VITE_APP_PUBLIC_KEY}`
//       )
//       .then(
//         (result) => {
//           Swal.fire({
//             position: "center",
//             icon: "success",
//             title: "Mensaje enviado correctamente.",
//             showConfirmButton: false,
//             timer: 1500,
//           });
//         },
//         (error) => {
//           console.log(error.text);
//         }
//       );
//     e.target.reset();
//   }

//   return (
//     <section id="contact-section">
//       <div className="background-contact">
//         <h1 className="container-text">¿Qué desea consultarnos?</h1>

//         <div className="container-contact">
//           <form onSubmit={sendEmail}>
//             <MDBCardHeader
//               className="py-3"
//               style={{ backgroundColor: "rgb(233,238,244)" }}
//             >
//               <MDBTypography tag="h5" className="mb-0 datos-contact">
//                 Datos para el contacto
//               </MDBTypography>
//             </MDBCardHeader>
//             <MDBInput
//               id="form4Example1"
//               wrapperClass="mb-4"
//               label="Nombre"
//               name="Nombre"
//               required
//               style={{ fontFamily: "Quicksand" }}
//             />
//             <MDBInput
//               type="email"
//               id="form4Example2"
//               wrapperClass="mb-4"
//               label="Email"
//               name="Email"
//               required
//               style={{ fontFamily: "Quicksand" }}
//             />
//             <MDBInput
//               id="form4Example1"
//               wrapperClass="mb-4"
//               label="Empresa"
//               name="Empresa"
//               required
//               style={{ fontFamily: "Quicksand" }}
//             />
//             <MDBTextArea
//               label="Mensaje"
//               id="textAreaExample"
//               rows={4}
//               name="Mensaje"
//               required
//               style={{ fontFamily: "Quicksand" }}
//             />
//             <br />
//             <button className="boton-contact">Enviar</button>
//           </form>
//         </div>
//         <Footer />
//       </div>
//     </section>
//   );
// }
import React from "react";
import { Card, Input, Typography, Button } from "antd";
import "./Contact.css";
import Footer from "../footer/Footer";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const { VITE_APP_SERVICE_ID, VITE_APP_TEMPLATE_ID, VITE_APP_PUBLIC_KEY } =
  import.meta.env;

const { TextArea } = Input;

export default function Contact() {
  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        `${VITE_APP_SERVICE_ID}`,
        `${VITE_APP_TEMPLATE_ID}`,
        e.target,
        `${VITE_APP_PUBLIC_KEY}`
      )
      .then(
        (result) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Mensaje enviado correctamente.",
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  }

  return (
    <section id="contact-section">
      <div className="background-contact">
        <h1 className="container-text">¿Qué desea consultarnos?</h1>

        <div className="container-contact">
          <form onSubmit={sendEmail}>
            <Card
              style={{ backgroundColor: "rgb(233,238,244)" }}
            >
              <h5 className="mb-0 datos-contact">
                Datos para el contacto
              </h5>
            </Card>
            <Input
              id="form4Example1"
              className="mb-4"
              placeholder="Nombre"
              name="Nombre"
              required
              style={{ backgroundColor: "rgb(233,238,244)" }}
            />
            <Input
              type="email"
              id="form4Example2"
              className="mb-4"
              placeholder="Email"
              name="Email"
              required
            />
            <Input
              id="form4Example1"
              className="mb-4"
              placeholder="Empresa"
              name="Empresa"
              required
            />
            <TextArea
              placeholder="Mensaje"
              id="textAreaExample"
              rows={4}
              name="Mensaje"
              required
            />
            <br />
            <Button className="boton-contact" htmlType="submit">
              Enviar
            </Button>
          </form>
        </div>
        <Footer />
      </div>
    </section>
  );
}
