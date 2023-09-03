import { Route } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import Loading from "./components/loading/Loading";
import NavBar from "./components/navbar/NavBar.jsx";
import ScrollToTop from "./components/scrolltotop/ScrollToTop.jsx";
import NotFound from "./components/notfound/NotFound.jsx";
import { Usuario } from "./components/usuario/Usuario";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/dashboard/Dashboard";
import { Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ResetPassword from "./components/resetPassword/ResetPassword";

const Home = lazy(() => import("./components/home/Home.jsx"));
const Nosotros = lazy(() => import("./components/nosotros/Nosotros.jsx"));
const Contact = lazy(() => import("./components/contact/Contact.jsx"));
const Soluciones = lazy(() => import("./components/soluciones/Soluciones.jsx"));
const Login = lazy(() => import("./components/login/Login"));
const RegisterBranch = lazy(() =>
  import("./components/registerBranch/RegisterBranch")
);

function App() {
  const user = useSelector((state) => state.user);


  return (
    <>
      <NavBar />
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/nosotros" element={<Nosotros />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/services" element={<Soluciones />} />
          <Route
            exact
            path="/login"
            element={
              user && user.userId ? (
                user.isAdmin ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/usuario" />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route exact path="/register" element={<RegisterBranch />} />
          <Route
            path="/usuario"
            element={
              user && user.userId && user.isAdmin === false ? (
                <Usuario />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            element={user && user.isAdmin ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route exact path="/resetPassword" element={<ResetPassword />} />
          <Route path="*" element={NotFound} />
        </Routes>
        <Helmet>
          <link rel="canonical" href={window.location.href} />
        </Helmet>
      </Suspense>
    </>
  );
}

export default App;
