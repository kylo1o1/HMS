import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const sideBarItems = [
    { icon: "/assets/admin/home_icon.svg", name: "Dashboard" ,path:"adm-dashboard"},
    { icon: "/assets/admin/appointment_icon.svg", name: "Appointments",path:"appointment-list" },
    { icon: "/assets/admin/add_icon.svg", name: "Add Doctors" , path:"add-doctor"},
    { icon: "/assets/admin/people_icon.svg", name: "Doctors" , path:"doctor-list"},
    { icon: "/assets/admin/add_icon.svg", name: "Add Medicine" , path:"add-medicine"},
    { icon: "/assets/admin/medicine_icon.svg" ,name:"Medicines", path:"medicine-list" }
  ];

  const [itemIndex, selectItem] = useState(null);

  return (
    <Container fluid>
      <Row>
        <Col xs={1} sm={1} md={3} lg={3} xl={2}  className="sidebar-col px-0">
          <div className="sidebar">
            <ul className="sidebar-items mt-2 ">
              {sideBarItems.map((item, index) => (
                
                  <Link to={`${item.path}`} className={`${itemIndex === index ? "selected-item" :""} d-flex     gap-3  align-items-center`} onClick={()=>selectItem(index)}>
                    <img src={item.icon} alt={item.name} />
                    <p className="mb-0 mt-0 text-start  ">{item.name}</p>
                  </Link>
              ))}
            </ul>
          </div>
        </Col>

        <Col xs={11} sm={11} md={9} lg={9} xl={10} className="p-0 content-area">
            <Outlet/>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
