import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import { Bounce, ToastContainer } from "react-toastify";
import "./App.css"
import Footer from "./Components/Footer";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Header from "./Components/Header";
import DoctorsList from "./Components/DoctorList";
import DoctorDetails from "./Components/DoctorDetails";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./Utils/Auth";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AddDoctor from "./Components/AdminComponents/AddDoctor";
import AdminDoctorList from "./Components/AdminComponents/AdminDoctorList";
import { useEffect } from "react";
import { fetchDocFail, fetchDocStart, fetchDocSuccess } from "./Redux/dataSlice";
import instance from "./Axios/instance";
function App() {

  const {isAuthenticated} = useSelector((state)=> (state?.auth?? false))
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        dispatch(fetchDocStart());
        const res = await instance.get('/admin/view-doctors', { withCredentials: true });
        console.log(res.data.doctors);
        
        if (res.data.success) {
          dispatch(fetchDocSuccess({ doctors: res.data?.doctors }));
        } else {
          dispatch(fetchDocFail(res.data.error));
        }
      } catch (error) {
        dispatch(fetchDocFail(error.message));
      }
    };

    fetchDoctors();
  }, [dispatch]);

  return (
    <Router>
          <Header/>

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
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/register" element={<Register/>}/>  
        <Route path="/login" element={<Login/>}/>
        <Route path="/doctorList" element={<Auth isAuthenticated={isAuthenticated} ><DoctorsList/></Auth>}/>
        <Route path="/doctorList/:id" element={<DoctorDetails/>}/>
        {/* <Route 
              path="/adminPanel" 
              element={<Auth isAuthenticated={isAuthenticated}>
                        <RoleBasedRoute allowedRoles={["Admin"]}>
                          <AdminDashboard/>
                        </RoleBasedRoute>
                      </Auth>}/>
         */}
        <Route path="/adminPanel" element={<AdminDashboard/>}>
          <Route path="add-doctor" element={<AddDoctor/>}/>
          <Route path="doctor-list" element={<AdminDoctorList/>}/>
          
        </Route>
        </Routes>
      <Footer/>
    </Router>
  )
}

export default App;
