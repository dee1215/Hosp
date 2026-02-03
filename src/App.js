import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Nurse from "./pages/Nurse";
import Doctor from "./pages/Doctor";
import Pharmacy from "./pages/Pharmacy";
import Billing from "./pages/Billing";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/nurse" element={<Nurse />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/billing" element={<Billing />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
