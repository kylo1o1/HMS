import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PatientRoutes from "./PatientRoutes";
import ProtectedRoute from "../Utils/ProtectedRoute";
import DoctorDashboard from "../Pages/Doctor/DoctorDashboard";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AdminRoutes from "./AdminRoutes";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminAppointments from "../Components/AdminComponents/AdminAppointments";
import AdminDoctorList from "../Components/AdminComponents/AdminDoctorList";
import AddDoctor from "../Components/AdminComponents/AddDoctor";
import AddMedicine from "../Components/AdminComponents/AddMedicine";
import AdminMedicineList from "../Components/AdminComponents/AdminMedicineList";
import DoctorHome from "../Components/DoctorComponents/DoctorHome";
import DocAppointments from "../Components/DoctorComponents/DocAppointments";
import DocPatients from "../Components/DoctorComponents/DocPatients";
import DoctorProfile from "../Components/DoctorComponents/DoctorProfile";
import DoctorSchedule from "../Components/DoctorComponents/DoctorSchedule";
import AdminMedicineDetail from "../Components/AdminComponents/AdminMedicineDetail";
import MedicineOrders from "../Components/AdminComponents/MedicineOrders";
import AdminFinance from "../Components/AdminComponents/AdminFInance";
import AdminHome from "../Components/AdminComponents/AdminHome";
import AdminPatients from "../Components/AdminComponents/AdminPatients";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import PatientHistory from "../Components/DoctorComponents/PatientHistory";


const AppRoutes = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<PatientRoutes/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="adminPanel/*" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route path="" element={<AdminDashboard/>} >
                    <Route path="" element={<AdminHome />} />
                    <Route path="patients" element={<AdminPatients/>}/>
                    <Route path="add-doctor" element={<AddDoctor />} />
                    <Route path="doctor-list" element={<AdminDoctorList />} />
                    <Route path="add-medicine" element={<AddMedicine />} />
                    <Route path="medicine-list" element={<AdminMedicineList />} />
                    <Route path="medicine-list/:medId" element={<AdminMedicineDetail/>}/>
                    <Route path="medicine-orders" element={<MedicineOrders/>}/>
                    <Route path="appointment-list" element={<AdminAppointments />} />
                    <Route path="finance" element={<AdminFinance/>}/>
                </Route>
            </Route>

            <Route path="docPanel/*" element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
                <Route path="" element={<DoctorDashboard />} >
                    <Route path="" element={<DoctorHome />} />
                    <Route path="appointments" element={<DocAppointments />} />
                    <Route path="patients" element={<DocPatients />} />
                    <Route path="patients/:patientId/appointments" element={<PatientHistory/>}/>
                    <Route path="profile" element={<DoctorProfile />} />
                    <Route path="schedule" element={<DoctorSchedule />} />
                </Route>
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
