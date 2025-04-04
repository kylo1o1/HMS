import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Hero.css"
const Hero = () => {
  return (
   <Container fluid className="hero-container">
      <Row className="hero-row">
        <Col md={6} className="hero-col-1">
          <p className="hero-header">
            Seamless Appointments
            <br />
             with Trusted Experts
          </p>
          <div className="d-flex gap-3 group-of-people ">
            <img src="/media/group_profiles.png" alt="group_of_people" />
            <p>
            Simply browse through our extensive list of trusted doctors, <br />
            schedule your appointment hassle-free.
            </p>
          </div>
          <a href={"#speciality"} className="hero-book-appointment gap-1">
            Book Appointment <FaArrowRight/>
          </a>
        </Col>
        <Col md={6} className="hero-col-2">
          <img src="media/header_img.png" alt="header_png" className="w-100" />
        </Col>
      </Row>
   </Container>
  );
};

export default Hero;
