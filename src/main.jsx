import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
// import esES from "antd/lib/locale/es_ES";
import esES from 'antd/locale/es_ES.js';
import "dayjs/locale/es.js"
dayjs.locale('es')

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
    <Router basename={import.meta.env.BASE_URL}>
      <ConfigProvider locale={esES}>
        <App />
      </ConfigProvider>
    </Router>
  </Provider>
);
