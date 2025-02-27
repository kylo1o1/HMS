import React from "react";
import { Container } from "react-bootstrap";
import { HashLoader } from "react-spinners";

const Loading = ({ size = 100, color = "#36d7b7", center = true }) => {
  return (
    <Container
      className={`d-flex ${center ? "justify-content-center align-items-center" : ""}`}
      style={{ minHeight: center ? "100vh" : "auto" }}
    >
      <HashLoader size={size} color={color} />
    </Container>
  );
};

export default Loading;
