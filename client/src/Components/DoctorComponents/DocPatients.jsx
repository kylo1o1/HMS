import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import "./DocPatients.css";

const fakePatients = [
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    image: "https://via.placeholder.com/50",
    active: "active",
    appointments: 10,
    completed: 7,
    cancelled: 3,
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    image: "",
    active: "inActive",
    appointments: 5,
    completed: 3,
    cancelled: 2,
  },
  {
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    image: "https://via.placeholder.com/50",
    active: "active",
    appointments: 8,
    completed: 5,
    cancelled: 3,
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    image: "",
    active: "inActive",
    appointments: 5,
    completed: 3,
    cancelled: 2,
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    image: "",
    active: "inActive",
    appointments: 5,
    completed: 3,
    cancelled: 2,
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    image: "",
    active: "inActive",
    appointments: 5,
    completed: 3,
    cancelled: 2,
  },
];

const DocPatients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setPatients(fakePatients);
  }, []);

  return (
    <Container fluid className="doc-patients-container">
      <h2 className="title">Patients Management</h2>
      <Row className="patients-list">
        {patients.length > 0 ? (
          patients.map((patient, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="patient-card">
                <Card.Body>
                  <div className="patient-info">
                    {patient.image ? (
                      <img src={patient.image} alt="User" className="patient-image" />
                    ) : (
                      <div className="default-user-icon">{patient.fullName.charAt(0)}</div>
                    )}
                    <div>
                      <h5 className="patient-name">{patient.fullName}</h5>
                      <p className="patient-email">{patient.email}</p>
                      {/* {patient.active === "inActive" && <Badge bg="danger">Banned</Badge>} */}
                    </div>
                  </div>
                  <div className="status-group">
                    <Badge bg="success">{patient.completed} Completed</Badge>
                    <Badge bg="danger">{patient.cancelled} Cancelled</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="no-patients">No patients available</p>
        )}
      </Row>
    </Container>
  );
};

export default DocPatients;
