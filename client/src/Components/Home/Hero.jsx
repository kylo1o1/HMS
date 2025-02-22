import React from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
const Hero = () => {
  return (
    <Container className="hero-container d-flex align-items-center mx-auto justify-content-center">
      <div className="hero-container-2 rounded-5">
        <Row className="hero-container-2-row align-items-center">
          <Col md={6} lg={5} className="hero-content-text pb-5">
            <div className="hero-title">
              <h1 className="hero-heading">
                Book Appointment <br /> 
                <span className="hero-heading-highlight">With Trusted Doctors</span>
              </h1>
              <p className="hero-subheading">
                Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
              </p>
              <button className="hero-book-appointment-btn">
                Book Appointment →
              </button>
            </div>
          </Col>

          <Col md={6} lg={7} className="hero-image-col">
            <Image
              className="hero-doctors-image"
              src="/media/header_img.png"
              alt="Group of doctors"
              loading="lazy"
            />
          </Col>
        </Row>
        
      </div>
    </Container>
  );
};

export default Hero;
