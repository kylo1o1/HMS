
import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import './Header.css'

const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary ">
    <Container>
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">About Us</Nav.Link>
          
        </Nav>
        <Nav className="ms-auto">
            Login
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
)
};

export default Header;
