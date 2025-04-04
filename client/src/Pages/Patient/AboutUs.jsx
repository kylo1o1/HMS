import React from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import "./AboutUs.css"; // External CSS

const AboutUs = () => {
  return (
    <Container className="about-us-section">
      <h2 className="text-center about-title">
        ABOUT <span className="highlight">US</span>
      </h2>

      <Row className="align-items-center justify-content-center about-content">
        <Col md={3} className="text-center">
          <Image src={"media/about_image.png"} alt="Hospital" fluid rounded className="about-image w-100" />
        </Col>

        <Col md={7} className="d-flex ">
         <div className="w-75">
          <p className="about-text">
              Welcome to <strong>Our Hospital Management System</strong>, a digital solution designed to make healthcare 
              more accessible and efficient. Our platform allows patients to <strong>book doctor appointments, buy 
              medicines online, and access medical services</strong> seamlessly.
            </p>
            <h5 className="vision-title">Our Vision</h5>
            <p className="vision-text">
              We aim to <strong>bridge the gap between patients and healthcare providers</strong>, ensuring a 
              smooth and hassle-free experience for all users. Whether scheduling an appointment, consulting a 
              doctor, or managing prescriptions, we are here to assist at every step.
            </p>
         </div>

          
        </Col>
      </Row>

      <h3 className="text-center mt-5">WHY CHOOSE US</h3>
      <Row className="why-choose-us    flex-lg-row  justify-content-center  ">
        <Col  sm={12} md={4} className="why-box">
          <h5>EFFICIENCY:</h5>
          <p>Quick and easy doctor appointment scheduling.</p>
        </Col>
        <Col md={4} className="why-box">
          <h5>CONVENIENCE:</h5>
          <p>Buy medicines online and consult doctors from home.</p>
        </Col>
        <Col md={4} className="why-box">
          <h5>SECURE & RELIABLE:</h5>
          <p>Advanced admin and doctor modules for seamless management.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
