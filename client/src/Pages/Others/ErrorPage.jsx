import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const ErrorPage = () => {
  return (
    <Container>
        <Row>
            <Col className="d-flex justify-content-center  ">
                <h1>                SORRY,We Couldnt Find That Page
                </h1>
            </Col>
        </Row>
    </Container>
  );
};

export default ErrorPage;
