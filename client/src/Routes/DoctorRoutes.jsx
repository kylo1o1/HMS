import { Routes, Route } from "react-router-dom";
import DoctorHome from "../../Components/DoctorComponents/DoctorHome";
import DocAppointments from "../../Components/DoctorComponents/DocAppointments";
import DocPatients from "../../Components/DoctorComponents/DocPatients";
import DoctorProfile from "../../Components/DoctorComponents/DoctorProfile";
import DoctorSchedule from "../../Components/DoctorComponents/DoctorSchedule";

const DoctorRoutes = () => {
    return (
        <Routes>
            <Route index element={<DoctorHome />} />
            <Route path="appointments" element={<DocAppointments />} />
            <Route path="patients" element={<DocPatients />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="schedule" element={<DoctorSchedule />} />
        </Routes>
    );
};

export default DoctorRoutes;
