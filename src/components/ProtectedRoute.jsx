import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    console.log("[ROUTE] User not logged in. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}