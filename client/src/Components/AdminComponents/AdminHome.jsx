  import React, { useState } from "react";
  import { Button, Card, Col, Container, Row } from "react-bootstrap";
  import { BiCalendarCheck, BiPlusCircle } from "react-icons/bi";
  import { BsBellFill, BsCashStack, BsClipboardData, BsClipboardDataFill, BsFileEarmarkText, BsPeopleFill, BsPersonPlus } from "react-icons/bs";
  import "./AdminHome.css"
  import { useSelector } from "react-redux";
import { selectAdminHomeData } from "../../Redux/selectors/adminSelector";
import { useNavigate } from "react-router-dom";

  const AdminHome = () => {

    

    const navigate = useNavigate()

    const { completedAppointments, noOfPatients,noOfDoctor,summary } = useSelector(selectAdminHomeData);
    console.log(summary);
    
    

    const SummaryCard = ({ title, value, icon, trend }) => (
      <Card className="admin-home-summary-card hover-effect">
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={3} className="summary-icon-container">
              <div className="icon-wrapper">
                {icon}
              </div>
            </Col>
            <Col xs={9} className="summary-content">
              <h6 className="text-uppercase text-muted mb-1">{title}</h6>
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="mb-0 display-5 fw-bold">{value}</h2>
                {trend && <span className={`trend-indicator ${trend}`}>▲2.5%</span>}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );

    return (
      <Container fluid className="admin-home">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          
        </div>

        {/* Quick Actions */}
        <Row className="admin-home-quick-actions mb-4">
          <Col xs={6} className="d-flex  flex-wrap gap-2">
            <Button variant="primary" className="admin-home-action-btn" onClick={()=> navigate("/adminPanel/add-doctor")}>
              <BsPersonPlus className="me-2" />
              Add Doctor
            </Button>
            <Button variant="success" className="admin-home-action-btn" onClick={()=> navigate('/adminPanel/add-medicine')}>
              <BiPlusCircle className="me-2" />
              Add Medicine
            </Button>
            
          </Col>
        </Row>

        {/* Stats Cards with enhanced shadows */}
        <Row className="g-4">
          {[
            { title: "Total Patients", value: noOfPatients, icon: <BsPeopleFill />, trend: "up" },
            { title: "Appointments", value: completedAppointments, icon: <BiCalendarCheck /> },
            { title: "Doctors", value: noOfDoctor, icon: <BsFileEarmarkText />, trend: "down" },
            { title: "Total Revenue", value:`₹ ${summary?.totalRevenue?.toFixed(0)}` || "n/a", icon: <BsCashStack />, trend: "up" },
          ].map((card, index) => (
            <Col key={index} xl={3} lg={6} md={6} sm={6}>
              <SummaryCard {...card} />
            </Col>
          ))}
        </Row>
      </Container>
    )
  };

  export default AdminHome;
