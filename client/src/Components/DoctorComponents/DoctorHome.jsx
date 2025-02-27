import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import "./DoctorHome.css";

const DoctorHome = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    latestAppointments: [],
  });

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      const data = {
        totalPatients: 120,
        totalAppointments: 350,
        completedAppointments: 280,
        cancelledAppointments: 20,
        latestAppointments: [
          { id: 1, patient: "John Doe", date: "25-02-2025", status: "Completed" },
          { id: 2, patient: "Jane Smith", date: "24-02-2025", status: "Scheduled" },
          { id: 3, patient: "Robert Brown", date: "23-02-2025", status: "Cancelled" },
        ],
      };
      setDashboardData(data);
    };

    fetchDashboardData();
  }, []);

  // Function to cancel a scheduled appointment
  const cancelAppointment = (id) => {
    setDashboardData((prevData) => ({
      ...prevData,
      latestAppointments: prevData.latestAppointments.map((appt) =>
        appt.id === id ? { ...appt, status: "Cancelled" } : appt
      ),
    }));
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        {[
          { label: "Total Patients", value: dashboardData.totalPatients },
          { label: "Total Appointments", value: dashboardData.totalAppointments },
          { label: "Completed Appointments", value: dashboardData.completedAppointments },
          { label: "Cancelled Appointments", value: dashboardData.cancelledAppointments },
        ].map((item, index) => (
          <Col xs={12} sm={6} md={3} key={index} className="mb-3">
            <Card className="dashboard-card">
              <Card.Body>
                <h5>{item.label}</h5>
                <h2>{item.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col xs={12} lg={6}>
          <h5 className="mb-3">Latest Appointments</h5>
          <div className="appointments-list">
            {dashboardData.latestAppointments.map((appt) => (
              <Card key={appt.id} className="appointment-card">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{appt.patient}</h6>
                    <p className="mb-0 text-muted">{appt.date}</p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className={`status-badge ${appt.status.toLowerCase()}`}
                    >
                      {appt.status}
                    </span>
                    {appt.status === "Scheduled" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancelAppointment(appt.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorHome;
