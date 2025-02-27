import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Bounce, ToastContainer } from "react-toastify";
import "./App.css";
import Footer from "./Components/Footer";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./Utils/Auth";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AddDoctor from "./Components/AdminComponents/AddDoctor";
import AdminDoctorList from "./Components/AdminComponents/AdminDoctorList";
import { useCallback, useEffect } from "react";
import { fetchDocFail, fetchDocStart, fetchDocSuccess } from "./Redux/dataSlice";
import instance from "./Axios/instance";
import { loginFailure, loginSuccess } from "./Redux/authSlice";
import AddMedicine from "./Components/AdminComponents/AddMedicine";
import AdminMedicineList from "./Components/AdminComponents/AdminMedicineList";
import { fetchMedFail, fetchMedStart, fetchMedSuccess } from "./Redux/medicineSlice";
import AdminHeader from "./Components/AdminComponents/AdminHeader";
import Header from "./Components/Header";
import AdminAppointments from "./Components/AdminComponents/AdminAppointments";
import AdmDefault from "./Components/AdminComponents/AdmDefault";
import DoctorDetails from "./Pages/Patient/DoctorDetails";
import DoctorsList from "./Pages/Patient/DoctorList";
import MedicineList from "./Pages/Patient/MedicineList";
import MedicineCart from "./Pages/Patient/MedicineCart";
import PatientProfile from "./Pages/Patient/PatientProfile";
import DoctorDashboard from "./Pages/Doctor/DoctorDashboard";
import DocAppointments from "./Components/DoctorComponents/DocAppointments";
import DocPatients from "./Components/DoctorComponents/DocPatients";
import DoctorProfile from "./Components/DoctorComponents/DoctorProfile";
import DoctorSchedule from "./Components/DoctorComponents/DoctorSchedule";
import DoctorHome from "./Components/DoctorComponents/DoctorHome";
import PatientAppointments from "./Pages/Patient/PatientAppointments";
import { cartFail, cartRequest, cartSuccess } from "./Redux/cartSlice";

function AppLayout() {
  const { user } = useSelector((state) => (state?.auth ?? false));
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/adminPanel");
  
  const fetchDoctors = useCallback(async () => {
    try {
      dispatch(fetchDocStart());
      const res = await instance.get('/admin/view-doctors', { withCredentials: true });
      res.data.success ? dispatch(fetchDocSuccess({ doctors: res.data?.doctors })) : dispatch(fetchDocFail(res.data.error));
    } catch (error) {
      dispatch(fetchDocFail(error.message));
    }
  }, [dispatch]);

  const verifyToken = useCallback(async () => {
    try {
      const res = await instance.get("/auth/verify-token", { withCredentials: true });
      res.data.success ? dispatch(loginSuccess(res.data)) : dispatch(loginFailure(res.data.message));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  }, [dispatch]);

  const fetchMedicine = useCallback(async () => {
    try {
      dispatch(fetchMedStart());
      const res = await instance.get('/medicine/viewAll', { withCredentials: true });
      res.data.success ? dispatch(fetchMedSuccess(res.data.medicines)) : dispatch(fetchMedFail(res.data.message));
    } catch (error) {
      dispatch(fetchMedFail(error.message));
    }
  }, [dispatch]);

  const fetchCart = useCallback(async () => {
    dispatch(cartRequest())
    if (user?.id) {
      try {
        const res = await instance.get(`/cart/${user.id}`, { withCredentials: true });
        if (res.data.success){ dispatch(cartSuccess(res.data.data))}
        else{
          dispatch(cartFail(res.data.message))
        }
      } catch (error) {
        console.error("Error fetching cart:", error.message);
        dispatch(cartFail("Cart Is Empty"))
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchDoctors();
    fetchMedicine();
    verifyToken();
  }, [fetchDoctors, fetchMedicine, verifyToken]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <>
      {isAdminRoute ? <AdminHeader /> : <Header />}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className="main-content">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctorList" element={<DoctorsList />} />
        <Route path="/doctorList/:speciality" element={<DoctorsList/>}/>
        <Route path="/appointment/:id" element={<DoctorDetails />} />
        <Route path="/medicineList" element={<MedicineList/>}/>
        <Route path="/medicineList/:form" element={<MedicineList/>}/>
        <Route path="/medicineCart" element={<MedicineCart/>}/>
        <Route path="/myProfile" element={<PatientProfile/>}/>
        <Route path="/myAppointments" element={<PatientAppointments/>}/>
        <Route path="/docPanel/" element={<DoctorDashboard/>}>
          <Route path="appointments" element={<DocAppointments/>}/>
          <Route path="patients" element={<DocPatients/>}/>
          <Route path="profile" element={<DoctorProfile/>}/>
          <Route path="schedule" element={<DoctorSchedule/>}/>
          <Route path="dashboard" element = {<DoctorHome/>}/>
        </Route>
        <Route path="/adminPanel/" element={<AdminDashboard />}>
          <Route path="adm-dashboard" element={<AdmDefault/>}/>
          <Route path="add-doctor" element={<AddDoctor />} />
          <Route path="doctor-list" element={<AdminDoctorList />} />
          <Route path="add-medicine" element={<AddMedicine />} />
          <Route path="medicine-list" element={<AdminMedicineList />} />
          <Route path="appointment-list" element={<AdminAppointments/>}/>
        </Route>
      </Routes>
      </div>
      { !isAdminRoute && <Footer /> }
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
