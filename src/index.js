import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import DataProvider from "./context/DataContext";
import { initializeLocalStorage } from "./utils/localStorageInit";
import "@tabler/core/dist/css/tabler.min.css";

// Initialize localStorage with default data
initializeLocalStorage();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <DataProvider>
      <App />
    </DataProvider>
  </AuthProvider>
);
