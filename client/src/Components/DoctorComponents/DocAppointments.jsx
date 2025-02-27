import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const DocAppointments = () => {
    const appointmentsData = [
        {
          id: 1,
          patient: 'John Doe',
          status: 'Confirmed', // status field
          dateTime: '2025-02-25 10:00 AM',
          doctor: 'Smith',
          fees: 100,
        },
        {
          id: 2,
          patient: 'Jane Doe',
          status: 'Pending',
          dateTime: '2025-02-26 02:00 PM',
          doctor: 'Brown',
          fees: 120,
        },
        {
          id: 3,
          patient: 'Mark Johnson',
          status: 'Cancelled',
          dateTime: '2025-02-27 09:30 AM',
          doctor: 'Carter',
          fees: 80,
        },
      ];
  return (
    <Container fluid className="appointment-wrapper">
      <Row className="mt-3">
        <Col xs={12}>
          <h5>Appointments</h5>
        </Col>
      </Row>

      {/* For larger screens, use a table-like layout */}
      <div className="d-none d-md-block appointment-table">
        <Row className="header-row align-items-center">
          <Col md={1}>#</Col>
          <Col md={2}>Patient</Col>
          <Col md={2}>Status</Col>
          <Col md={3}>Date &amp; Time</Col>
          <Col md={2}>Doctor</Col>
          <Col md={1}>Fees</Col>
          <Col md={1}>Action</Col>
        </Row>
        {appointmentsData.map((appointment, index) => (
          <Row key={appointment.id} className="data-row align-items-center">
            <Col md={1}>{index + 1}</Col>
            <Col md={2}>{appointment.patient}</Col>
            <Col md={2}>{appointment.status}</Col>
            <Col md={3}>{appointment.dateTime}</Col>
            <Col md={2}>Dr. {appointment.doctor}</Col>
            <Col md={1}>₹ {appointment.fees}</Col>
            <Col md={1}>
              <Button variant="primary" className="appointment-close-btn">
                <img src="/assets/admin/cross_icon.png" alt="Close" className="w-100" />
              </Button>
            </Col>
          </Row>
        ))}
      </div>

      {/* For smaller screens, use cards */}
      <div className="d-block d-md-none">
        {appointmentsData.map((appointment, index) => (
          <Card key={appointment.id} className="mb-3 appointment-card">
            <Card.Body>
              <Row>
                <Col xs={8}>
                  <Card.Title>{appointment.patient}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {appointment.status}
                  </Card.Subtitle>
                </Col>
                <Col xs={4} className="text-end">
                  <Button variant="primary" className="appointment-close-btn">
                    <img src="/assets/admin/cross_icon.png" alt="Close" className="w-100" />
                  </Button>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12}>
                  <strong>Date &amp; Time:</strong> {appointment.dateTime}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12}>
                  <strong>Doctor:</strong> Dr. {appointment.doctor}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12}>
                  <strong>Fees:</strong> ₹ {appointment.fees}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default DocAppointments;
