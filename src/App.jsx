import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Helmet } from 'react-helmet'
import Loading from "./components/loading/Loading";
import NavBar from "./components/navbar/NavBar.jsx";
import ScrollToTop from "./components/scrolltotop/ScrollToTop.jsx";
import NotFound from "./components/notfound/NotFound.jsx";

const Home = lazy(() => import("./components/home/Home.jsx"));
const Nosotros = lazy(() => import("./components/nosotros/Nosotros.jsx"));
const Contact = lazy(() => import("./components/contact/Contact.jsx"));
const Soluciones = lazy(() => import("./components/soluciones/Soluciones.jsx"));

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <NavBar />
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/nosotros" element={<Nosotros />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/services" element={<Soluciones />} />
          <Route path="*" element={NotFound} />
        </Routes>
        <Helmet>
          <link rel="canonical" href={window.location.href} />
        </Helmet>
      </Suspense>
    </Router>
  );
}

export default App;
