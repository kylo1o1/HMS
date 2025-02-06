import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import './Home.css'
const Hero = () => {
  return (
    <Container  fluid className="hero-container d-flex">
        <div className="hero-container-2  ">
          <Row className="hero-container-2-row">
            <Col md={5} className="hero-content-text d-flex ">
                
                <div className="hero-title  ">

                  <div className="hot-tag">
                  <p className="hero-text-hot-tag">#1 Best medical Center</p>
                  </div>

                  <p className="hero-text-main">
                    The <span className="main-text-highlight">Best Medical </span>  and Treatment  Center For You
                  </p>
                  <p className="hero-text-bottom">Connect with our professional doctors who are ready to help you manage <br /> your help you manage your health with expertise and dedication</p>

                  <div className="hero-book-appointment">
                    <span>                      Book An Appointment
                    </span>
                  </div>
                </div>

                
            </Col>
            <Col className=""> 
              <div className="w-100 ">
                <Image className="w-100" src="/media/very-good-smiling-confident-asian-female-doctor-showing-okay-ok-sign-approval-confirm-smth-saying.png" alt="asian-hero-doctor" />
              </div>
            </Col>
          </Row>
        </div>
    </Container>
  );
};

export default Hero;
