import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import './Home.css'
const Hero = () => {
  return (
    <Container  fluid className="hero-container">
        <div className="gradient-wrap">
          <Row>
            <Col md={3}>
                <div className="hot-tag">
                  <p>#1 Best medical Center</p>
                </div>

                <div>
                  <h1>
                    The Best Medical Center and Treatment Center For You
                  </h1>
                </div>

                <div>
                  <p>Connect with our professional doctors who are ready to help you manage your help you manage your health with expertise and dedication</p>
                </div>
                <div>
                  
                </div>
            </Col>
          </Row>
        </div>
    </Container>
  );
};

export default Hero;
