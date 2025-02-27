import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const sideBarItems = [
    { icon: "/assets/admin/home_icon.svg", name: "Dashboard", path: "dashboard" },
    { icon: "/assets/admin/appointment_icon.svg", name: "Appointments", path: "appointments" },
    { icon: "/assets/admin/people_icon.svg", name: "Patients", path: "patients" },
    { icon: "/assets/admin/user.png", name: "Profile", path: "profile" },
    {icon:"/assets/admin/prescription.png",name:"Schedule",path:"schedule"}
  ];

  const location = useLocation()
  const segment = location.pathname.split('/')
  const currentLocation = segment[segment.length - 1]
  console.log(currentLocation);
  
  const [itemIndex, selectItem] = useState(null);
  useEffect(()=>{
    selectItem(currentLocation)
  },[currentLocation])

  return (
    <Container fluid>
      <Row>
        <Col xs={1} sm={1} md={3} lg={3} xl={2} className="doc-sidebar-col px-0">
          <div className="doc-sidebar">
            <ul className="doc-sidebar-items mt-2">
              {sideBarItems.map((item, index) => (
                <Link to={`${item.path}`} className={`${itemIndex === item.path  ? "doc-selected-item" : ""} d-flex gap-3 align-items-center`} onClick={() => selectItem(index)}>
                  <img src={item.icon} alt={item.name} />
                  <p className="mb-0 mt-0 text-start">{item.name}</p>
                </Link>
              ))}
            </ul>
          </div>
        </Col>

        <Col xs={11} sm={11} md={9} lg={9} xl={10} className="p-0 doc-content-area">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
