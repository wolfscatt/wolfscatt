import { Navigate } from "react-router-dom";

export default function FaultCodeRedirect() {
  return <Navigate to="/products/faultcode" replace />;
}
