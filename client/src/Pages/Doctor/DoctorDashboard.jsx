import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./DoctorDashboard.css";
import { useDispatch } from "react-redux";
import instance from "../../Axios/instance";
import { fetchPatientAppointmentsStart, fetchPatientAppointmentsSuccess } from "../../Redux/patientAppointments";
import { fetchAppointmentsFailure, fetchAppointmentsStart, fetchAppointmentsSuccess } from "../../Redux/doctorAppoinments";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const sideBarItems = [
    { icon: "/assets/admin/home_icon.svg", name: "Dashboard", path: "" },
    { icon: "/assets/admin/appointment_icon.svg", name: "Appointments", path: "appointments" },
    { icon: "/assets/admin/people_icon.svg", name: "Patients", path: "patients" },
    { icon: "/assets/admin/user.png", name: "Profile", path: "profile" },
    { icon: "/assets/admin/prescription.png", name: "Schedule", path: "schedule" }
  ];

  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const dispatch = useDispatch()

  useEffect(() => {
    const currentPath = location.pathname.replace("/docPanel/", "");
    setActiveItem(currentPath || "");
  }, [location.pathname]);

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      dispatch(fetchAppointmentsStart());
      try {
        const { data } = await instance.get("/appointments/doctorAppointments", { withCredentials: true });
  
        if (data.success) {
          dispatch(fetchAppointmentsSuccess
            ({
              appointments: data.appointments,
              numberOfPatients: data.numberOfPatients,
              numberOfCompletedAppointments: data.numberOfCompletedAppointments,
              numberOfCancelledAppointments: data.numberOfCancelledAppointments,
            })
          );
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
        dispatch(fetchAppointmentsFailure(error.message));
      }
    };
  
    fetchDoctorAppointments();
  }, [dispatch]); 
  

  return (
    <div className="doctor-dashboard-container">
      <div className="doc-sidebar-col">
        <div className="doc-sidebar">
          <ul className="doc-sidebar-items mt-1">
            {sideBarItems.map((item, index) => (
              <Link
                key={index}
                to={`/docPanel/${item.path}`}
                className={`${activeItem === item.path ? "doc-selected-item" : ""} d-flex gap-3 align-items-center`}
                onClick={() => setActiveItem(item.path)}
              >
                <img src={item.icon} alt={item.name} />
                <p className="mb-0 mt-0 text-start">{item.name}</p>
              </Link>
            ))}
          </ul>
        </div>
      </div>
      <div className="doc-content-area">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDashboard;
