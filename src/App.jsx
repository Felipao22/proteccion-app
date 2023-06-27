import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import Loading from "./components/loading/Loading";
import NavBar from "./components/navbar/NavBar.jsx";
import ScrollToTop from "./components/scrolltotop/ScrollToTop.jsx";
import NotFound from "./components/notfound/NotFound.jsx";
import { File } from "./components/file/File";
import { Usuario } from "./components/usuario/Usuario"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./components/home/Home.jsx"));
const Nosotros = lazy(() => import("./components/nosotros/Nosotros.jsx"));
const Contact = lazy(() => import("./components/contact/Contact.jsx"));
const Soluciones = lazy(() => import("./components/soluciones/Soluciones.jsx"));
// const File = lazy(() => import("./components/file/File.jsx"));

function App() {
  return (
    <Provider store={store}>
    <Router basename={import.meta.env.BASE_URL}>
      <NavBar />
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
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
          <Route exact path="/file" element={<File />} />
          <Route exact path="/usuario" element={<Usuario />} />
          <Route path="*" element={NotFound} />
        </Routes>
        <Helmet>
          <link rel="canonical" href={window.location.href} />
        </Helmet>
      </Suspense>
    </Router>
    </Provider>
  );
}

export default App;
