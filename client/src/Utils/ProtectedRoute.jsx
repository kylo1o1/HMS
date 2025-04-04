import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Pages/Others/Loading";
import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state?.auth );
   
  useEffect(() => {
    if (!user && window.location.pathname !== "/login") {
      toast.warn("Please log in first!", { position: "top-right" });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if ( !allowedRoles.includes(user.role)) {
    toast.error("Access Denied: You don't have permission!", { position: "top-right" });
    if(user.role === "Doctor") return <Navigate to="/docPanel" replace />;
    if(user.role === "Admin") return <Navigate to={'/adminPanel'} replace/>
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
