import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Features.css"; // Keep styles separate for organization

const features = [
  { icon: "🏥", title: "Hospital Administration", desc: "Manage hospital data efficiently." },
  { icon: "🩺", title: "Doctor & Patient Management", desc: "Streamline doctor-patient interactions." },
  { icon: "📅", title: "Appointment Scheduling", desc: "Automate and track appointments." },
  { icon: "📄", title: "Medical Records & Reports", desc: "Secure digital medical history." },
];

const Features = () => {
  return (
    <section id="features">
      <Container fluid className="features-container">
        <Row className="justify-content-center ">
          {features.map((feature, index) => (
            <Col md={6} lg={3} key={index} className="mb-4">
              <div className="feature-card">
                <div className="icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;
