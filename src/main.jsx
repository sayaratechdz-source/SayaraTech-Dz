import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/route.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./Redux/store.js";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
