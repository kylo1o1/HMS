
import axios from "axios";
import React from "react";
import { Button, Container, Nav, Navbar, } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Links } from "react-router-dom";
import instance from "../Axios/instance";
import { toast } from "react-toastify";
import { logout } from "../Redux/authSlice";

const Header = () => {
  const {isAuthenticated} = useSelector((state)=>(state?.auth ??  false));
  console.log(isAuthenticated);
  const disptach = useDispatch()
  
  const handleLogout = async ()=>{
    try {
      const res = await instance.get('/logout',{withCredentials:true})
      
      if(res.data.success){
        toast.success(" You have been Logged out ")
        disptach(logout())
      }else{
        toast.error("Logout Failed")
      }

    } catch (error) {
            toast.error("Logout Failed");
      
    }
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary px-4">
      <Container className="mx-auto">
        <Navbar.Brand href="#home">HealthSync</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link as={Link} to={"/adminPanel"}>About Us</Nav.Link>
            <Nav.Link as={Link} to={"/doctorList"}>Doctors</Nav.Link>
            <Nav.Link href="/medicines">Medicines</Nav.Link>
          </Nav>
          {isAuthenticated ? (<Button variant="danger" type="button" className="ms-auto" onClick={handleLogout}>LogOut</Button>):(<Nav className="ms-auto hero-login" as={Link} to={'/login'} >Login</Nav>)}         
           

        </Navbar.Collapse>
      </Container>
    </Navbar>
)
};

export default Header;
