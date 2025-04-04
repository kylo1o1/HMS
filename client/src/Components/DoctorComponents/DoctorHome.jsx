import React from "react";
import { Card, Col, Container, Row, Button, Badge } from "react-bootstrap";
import { 
  FaUser, FaCalendarCheck, FaCheckCircle, 
  FaTimesCircle, FaClock, FaStethoscope, FaPlus, 
  FaCalendarTimes
} from "react-icons/fa";
import "./DoctorHome.css";
import { useSelector } from "react-redux";
import { formatDateWithMoment } from "../../Utils/dateUtils";
import { getInitials, stringToColor } from "../../Utils/helpers";
import { isToday } from "date-fns";
import { useNavigate } from "react-router-dom";



const NoAppointmentsToday = ({ doctorName }) => (
  <div className="dh-no-appointments">
    <div className="dh-empty-state">
      <div className="dh-empty-icon">
        <FaCalendarTimes />
      </div>
      <h4 className="dh-empty-title">No Appointments Today</h4>
      <p className="dh-empty-text">
        {`Dr. ${doctorName}, you don't have any scheduled appointments for today.`}
        <br />
        Enjoy your day!
      </p>
      
    </div>
  </div>
);



const DoctorHome = () => {
  const { appointments, stats } = useSelector((state) => state?.doctorAppointmentData);

  const {user} = useSelector((state)=>state?.auth?? [])

  const statsConfig = [
    { 
      label: "Total Patients", 
      value: stats.numberOfPatients,
      icon: <FaUser className="stat-icon" />,
      trend: "+12%",
      bgColor: "#eef0ff",
      path:"/patients"
    },
    { 
      label: "Appointments", 
      value: appointments.length,
      icon: <FaCalendarCheck className="stat-icon" />,
      trend: "+5%",
      bgColor: "#e6faf6",
      path:"/appointments"

    },
    { 
      label: "Completed", 
      value: stats.numberOfCompletedAppointments,
      icon: <FaCheckCircle className="stat-icon" />,
      trend: "82%",
      bgColor: "#e6faf6"
    },
    { 
      label: "Cancelled", 
      value: stats.numberOfCancelledAppointments,
      icon: <FaTimesCircle className="stat-icon" />,
      trend: "4%",
      bgColor: "#feeceb"
    },
  ];

  const navigate = useNavigate()

  const todaysAppointments = appointments.filter((appt)=> appt.slotDate && isToday(appt.slotDate))


  return (
    <Container fluid className="doctor-dashboard">
      <Row className="mb-4">
        <Col xs={12}>
          <div className="dashboard-header">
            <div className="header-content">
              <h1 className="dashboard-title">
                <FaStethoscope className="header-icon" />
                Welcome Back, Dr. {user.name}
              </h1>
              <p className="dashboard-subtitle">Here's your daily overview</p>
            </div>
            
          </div>
        </Col>
      </Row>

      <Row className="stats-row">
        {statsConfig.map((item, index) => (
          <Col xs={12} sm={6} xl={3} key={index} className="mb-4">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon-container" style={{ backgroundColor: item.bgColor }}>
                  {React.cloneElement(item.icon,)}
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{item.value}</h3>
                  <div className="stat-meta">
                    <span className="stat-label">{item.label}</span>
                    <Badge 
                      className="stat-trend"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      {item.trend}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="appointments-card">
            <Card.Header className="appointments-header">
              <h5 className="appointments-title">
                <FaClock className="me-2" />
                Today's Appointments
                <Badge pill className="ms-2">
                  {todaysAppointments.length  === 0 ? "" : todaysAppointments.length}
                </Badge>
              </h5>
              <Button variant="link" className="view-all-btn" onClick={()=> navigate('/docPanel/appointments')}>
                View All →
              </Button>
            </Card.Header>
            <Card.Body>
              {todaysAppointments.length === 0 ? (
                <NoAppointmentsToday doctorName={user.name}/>
              ):(
                <div className="appointments-list">
                {todaysAppointments.map((appt) => (
                  <div key={appt._id} className="appointment-item">
                    <div className="patient-info">
                      <div 
                        className="patient-avatar"
                        style={{ backgroundColor: stringToColor(appt.patientId.name) }}
                      >
                        {getInitials(appt.patientId.name)}
                      </div>
                      <div className="patient-details">
                        <h6 className="patient-name">{appt.patientId.name}</h6>
                        <div className="appointment-time">
                          <span className="date">{formatDateWithMoment(appt.slotDate)}</span>
                          <span className="time-badge">
                            <FaClock className="me-1" />
                            {appt.slotTime || "10:00 AM"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="appointment-status">
                      <Badge 
                        className={`status-badge ${appt.status.toLowerCase()}`}
                        pill
                      >
                        {appt.status}
                      </Badge>
                      {appt.status === "Scheduled" && (
                        <Button 
                          variant="link" 
                          className="cancel-btn"
                          title="Cancel Appointment"
                        >
                          <FaTimesCircle />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )}
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};





export default DoctorHome;