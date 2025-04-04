import React, { useEffect, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./AdminDashboard.css";
import instance from "../../Axios/instance";
import { useDispatch, useSelector } from "react-redux";
import { appFetchSuccess, appLoading } from "../../Redux/adminAppoinments";
import { toast } from "react-toastify";
import { fetchPatientsFail, fetchPatientsStart, fetchPatientsSuccess } from "../../Redux/patientsSlice";
import { fetchRevenueFail, fetchRevenueStart, fetchRevenueSuccess } from "../../Redux/revenueSlice";
import { selectAdminHomeData } from "../../Redux/selectors/adminSelector";

const sidebarItems = [
  { icon: "/assets/admin/home_icon.svg", name: "Dashboard", path: "" },
  {icon :"/assets/admin/patient.png", name:"Patients", path:"patients"},
  { icon: "/assets/admin/appointment_icon.svg", name: "Appointments", path: "appointment-list" },
  { icon: "/assets/admin/add_icon.svg", name: "Add Doctors", path: "add-doctor" },
  { icon: "/assets/admin/people_icon.svg", name: "Doctors", path: "doctor-list" },
  { icon: "/assets/admin/add_icon.svg", name: "Add Medicine", path: "add-medicine" },
  { icon: "/assets/admin/medicine_icon.svg", name: "Medicines", path: "medicine-list" },
  { icon: "/assets/admin/icons8-order-100.png", name: "Medicine Orders", path: "medicine-orders" },
  { icon: "/assets/admin/money.png", name: "Finance", path: "finance" },
];

const AdminDashboard = () => {
  const location = useLocation();
  const activeItem = useMemo(() => location.pathname.replace("/adminPanel/", ""), [location.pathname]);

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchAppointment =  async()=>{
      dispatch(appLoading())

      try {
        const {data } = await instance.get("/appointments/adminAppointments",{withCredentials:true})
        if(data.success){
          dispatch(appFetchSuccess({appointments:data.appointments,completed:data.numberOfCompletedAppointments}))
        }else{
          throw new Error(data.message)
        }

      } catch (error) {
        toast.error(error.message || "Failed To Fetch Appointments")
      }
    }
    const fetchPatients = async () => {
      dispatch(fetchPatientsStart())
      try {

        const {data} = await instance.get("/admin/view-patients",{withCredentials:true})

        if(data.success){
          console.log(data.patients);
          
          dispatch(fetchPatientsSuccess({patients:data.patients,noOfPatients:data.noOfPatients}))

        }else{
          throw new Error(data.message)
        }

      } catch (error) {
        toast.error(error.message || "Failed To Fetch Patients")
        dispatch(fetchPatientsFail(error))
      }
    }
    const fetchRevenue = async () => {
      try {
        dispatch(fetchRevenueStart());
        const res = await instance.get("/revenue/summary",{withCredentials:true})
        if(res.data.success){
          console.log(res.data);
          dispatch(fetchRevenueSuccess(res.data.summary));
        }else{
          throw new Error(res.data.message);
          
        }

      } catch (error) {
        toast.error(error.message)
        dispatch(fetchRevenueFail(error.response.data.message));
      }
    }
    fetchRevenue()
    fetchAppointment()
    fetchPatients()
  },[])

  
 
  return (
    <div className="admin-dashboard">
      <nav className="sidebar-wrapper">
        <ul className="sidebar-items p-0 mt-1">
          {sidebarItems.map(({ icon, name, path }, index) => (
            <li key={index}>
              <Link
                to={`/adminPanel/${path}`}
                className={`d-flex gap-3 align-items-center ${activeItem === path ? "selected-item" : ""}`}
                aria-current={activeItem === path ? "page" : undefined}
              >
                <img src={icon} alt={name} />
                <p className="mb-0 mt-0 text-start">{name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="content-area flex-wrap">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
