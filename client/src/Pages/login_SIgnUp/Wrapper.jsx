import React from "react";
import { Container } from "react-bootstrap";
import "./Wrapper.css"

const Wrapper = ({children}) => {
  return (
        <Container fluid className="wrap-gradient">
            {children}
        </Container>
  )
};

export default Wrapper;
