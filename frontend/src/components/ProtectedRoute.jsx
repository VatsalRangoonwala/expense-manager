import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
