
import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../Axios/instance";
import { toast } from "react-toastify";
import { logout } from "../../Redux/authSlice";
import { Link } from "react-router-dom";
import "../Header.css"

const AdminHeader = () => {
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
        
      }}
  return (
    <Navbar expand="lg" className="bg-body-tertiary px-4 adm-navbar">
    <Container fluid className="mx-auto">
      <Navbar.Brand href="#home">
       <div className="d-flex gap-3 adm-header-right">
            <h3 className="mb-0">HealthSync</h3>
            <p className="adm-header-indicator">Admin</p>
       </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        
        {isAuthenticated ? (<Button variant="danger" type="button" className="ms-auto" onClick={handleLogout}>LogOut</Button>):(<Nav className="ms-auto hero-login" as={Link} to={'/login'} >Login</Nav>)}         
         

      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
};

export default AdminHeader;
