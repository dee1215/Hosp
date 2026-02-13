import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  // Check both context and localStorage for persistent auth
  const isAuthenticated = user || localStorage.getItem("user");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
