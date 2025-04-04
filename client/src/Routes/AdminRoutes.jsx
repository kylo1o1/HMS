import { Route, Routes } from "react-router-dom";
import AdmDefault from "../Components/AdminComponents/AdminHome";
import AddDoctor from "../Components/AdminComponents/AddDoctor";
import AdminDoctorList from "../Components/AdminComponents/AdminDoctorList";
import AddMedicine from "../Components/AdminComponents/AddMedicine";
import AdminMedicineList from "../Components/AdminComponents/AdminMedicineList";
import AdminAppointments from "../Components/AdminComponents/AdminAppointments";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route index element={<AdmDefault />} />
            <Route path="add-doctor" element={<AddDoctor />} />
            <Route path="doctor-list" element={<AdminDoctorList />} />
            <Route path="add-medicine" element={<AddMedicine />} />
            <Route path="medicine-list" element={<AdminMedicineList />} />
            <Route path="appointment-list" element={<AdminAppointments />} />
        </Routes>
    );
};

export default AdminRoutes;
