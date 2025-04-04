import { Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import DoctorsList from "../Pages/Patient/DoctorList";
import DoctorDetails from "../Pages/Patient/DoctorDetails";
import MedicineList from "../Pages/Patient/MedicineList";
import MedicineCart from "../Pages/Patient/MedicineCart";
import PatientProfile from "../Pages/Patient/PatientProfile";
import PatientAppointments from "../Pages/Patient/PatientAppointments";
import OrderHistory from "../Pages/Patient/OrderHistory";
import AboutUs from "../Pages/Patient/AboutUs";

const PatientRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/doctorList" element={<DoctorsList />} />
            <Route path="/doctorList/:speciality" element={<DoctorsList />} />
            <Route path="/appointment/:id" element={<DoctorDetails />} />
            <Route path="/medicineList" element={<MedicineList />} />
            <Route path="/medicineList/:form" element={<MedicineList />} />
            <Route path="/medicineCart" element={<MedicineCart />} />
            <Route path="/myProfile" element={<PatientProfile />} />
            <Route path="/myAppointments" element={<PatientAppointments />} />
            <Route path="/orderHistory" element={<OrderHistory />} />
            <Route path="/aboutUs" element={<AboutUs />} />
        </Routes>
    );
};

export default PatientRoutes;
