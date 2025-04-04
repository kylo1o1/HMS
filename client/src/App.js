import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter as Router,   useLocation, useNavigate } from 'react-router-dom';
import {  toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import instance from "./Axios/instance";
import { loginFailure, loginStart, loginSuccess, logout } from "./Redux/authSlice";
import { fetchDocFail, fetchDocStart, fetchDocSuccess } from "./Redux/dataSlice";
import { fetchMedFail, fetchMedStart, fetchMedSuccess } from "./Redux/medicineSlice";
import { cartFail, cartRequest, cartSuccess } from "./Redux/cartSlice";

import Footer from "./Components/Footer";
import Header from "./Components/Header";
import AdminHeader from "./Components/AdminComponents/AdminHeader";
import Loading from "./Pages/Others/Loading";
import AppRoutes from "./Routes/AppRoutes";

function AppLayout() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isOtherRoute = location.pathname.startsWith("/adminPanel") || location.pathname.startsWith("/docPanel");
  const isLoginRegister = location.pathname.startsWith("/login") 
                          || location.pathname.startsWith("/register")
                          || location.pathname.startsWith("/forgot-password");

  const fetchData = useCallback(async () => {
    try {
      dispatch(fetchDocStart());
      dispatch(fetchMedStart());

      const [docRes, medRes] = await Promise.all([
        instance.get('/admin/view-doctors', { withCredentials: true }),
        instance.get('/medicine/viewAll', { withCredentials: true })
      ]);

      docRes.data.success
        ? dispatch(fetchDocSuccess({ doctors: docRes.data.doctors, noOfDoctors: docRes.data.noOfDoctors }))
        : dispatch(fetchDocFail(docRes.data.error));

      medRes.data.success
        ? dispatch(fetchMedSuccess(medRes.data.medicines))
        : dispatch(fetchMedFail(medRes.data.message));
    } catch (error) {
      dispatch(fetchDocFail(error.message));
      dispatch(fetchMedFail(error.message));
    }
  }, [dispatch]);

  const verifyToken = useCallback(async () => {
    dispatch(loginStart());
    try {
        const res = await instance.get("/auth/verify-token", { withCredentials: true });
  
        if (res.data.success) {
            dispatch(loginSuccess(res.data));
            const userRole = res.data.user.role;
            if (userRole === "Admin") {
                navigate("/adminPanel");
            } else if (userRole === "Doctor") {
                navigate("/docPanel");
            }
        }else{
          throw new Error(res.data.message);
          
        }
    } catch (error) {
        console.error(error.message);
        toast.error("Session Expired! Please Login Again");
        dispatch(logout({ dispatch }));
        navigate('/login');
    } finally {
        setLoading(false);
    }
  }, [dispatch, navigate]);
  

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await instance.get("/auth/verify-token", { withCredentials: true });
      } catch (error) {
        console.warn("Token expired or removed.");
        toast.error("Session expired. Please log in again.");
        dispatch(logout());
        navigate('/login');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  const fetchCart = useCallback(async () => {
    if (user?.id && user.role === "Patient") {
      dispatch(cartRequest());
      try {
        const res = await instance.get(`/cart/${user.id}`, { withCredentials: true });
  
        if (res.data.success) {
          dispatch(cartSuccess(res.data.data.cart || [])); 
        } else {
          dispatch(cartSuccess([]));
        }
      } catch (error) {
        dispatch(cartFail(error.message));
        toast.error(error.message);
      }
    }
  }, [dispatch, user]);
  

  // ✅ Auto-Fetch Data & Verify Token
  useEffect(() => {
    const initializeApp = async () => {
      if (!user && sessionStorage.getItem("token")) {
        await verifyToken();
      }
      if (user) {
        await fetchData();
      }
      setLoading(false);
    };
    initializeApp();
  }, [user, verifyToken, fetchData]);

  useEffect(() => {
    if (user?.role === "Patient") {
      fetchCart();
    }
  }, [fetchCart, user]);

  if (loading) return <Loading />;

  return (
    <>
      {isOtherRoute ? <AdminHeader /> : isLoginRegister ? null : <Header />}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="main-content">
        <AppRoutes />
      </div>
      {!isOtherRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
