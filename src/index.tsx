import ReactDOM from "react-dom/client";

import App from "./App";
import AuthProvider from "./context/AuthContext";
import DataProvider from "./context/DataContext";
import { initializeLocalStorage } from "./utils/localStorageInit";
import "@tabler/core/dist/css/tabler.min.css";

// Initialize localStorage with default data
initializeLocalStorage();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

const root = ReactDOM.createRoot(rootEl);
root.render(
  <AuthProvider>
    <DataProvider>
      <App />
    </DataProvider>
  </AuthProvider>
);
