import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Image, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import instance from "../Axios/instance";
import { toast } from "react-toastify";
import { logout } from "../Redux/authSlice";
import { BsCart } from "react-icons/bs";

const Header = () => {
  const { isAuthenticated } = useSelector((state) => (state?.auth ?? false));
  const dispatch = useDispatch();
  const count = useSelector((state)=> state?.cartSl?.cart?.medicines.length  || 0)
  console.log(count);
  
  const location = useLocation()

  const handleLogout = async () => {
    try {
      const res = await instance.get("/logout", { withCredentials: true });
      if (res.data.success) {
        toast.success("You have been logged out");
        dispatch(logout());
      } else {
        toast.error("Logout Failed");
      }
    } catch (error) {
      toast.error("Logout Failed");
    }
  };


  // Authenticated menu items for small screens using Nav
  const authNavItemsSmallScreen = (
    <Nav>
      <Nav.Link as={Link} to="/myProfile">
        My Profile
      </Nav.Link>
      <Nav.Link as={Link} to="/myAppointments">
        My Appointments
      </Nav.Link>
      <Nav.Link as={Link} to="/previousMedicineOrders">
        Previous Medicine Orders
      </Nav.Link>
      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </Nav>
  );

  return (
    <Navbar expand="lg" className="bg-body-tertiary px-4 border-bottom ">
      <Container>
        <Navbar.Brand as={Link} to="/">HealthSync</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
          <Nav.Link 
                  as={Link} 
                  to="/" 
                  className={location.pathname === "/" ? "active-nav" : ""}
                >
                  Home <hr className="hr-under-navs" />
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/adminPanel" 
                  className={location.pathname.startsWith("/adminPanel") ? "active-nav" : ""}
                >
                  About Us <hr className="hr-under-navs" />
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/doctorList" 
                  className={location.pathname.startsWith("/doctorList") ? "active-nav" : ""}
                >
                  Doctors <hr className="hr-under-navs" />
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/medicineList" 
                  className={location.pathname.startsWith("/medicineList") ? "active-nav" : ""}
                >
                  Medicines <hr className="hr-under-navs" />
                </Nav.Link>

          </Nav>
          <Nav className="me-3">
            <Nav.Link as={Link} to="/medicineCart">
              <BsCart size={20} className="header-cart" />
              <Badge className="header-cart-count">
                {count >= 1 ? count :null}
              </Badge>
            </Nav.Link>
          </Nav>
          {isAuthenticated ? (
            <>
              {/* Large screens: display avatar dropdown */}
              <Nav className="d-none d-lg-flex">
                <NavDropdown
                  title={
                    <Image
                      src="/media/profile.png"
                      roundedCircle
                      alt="User Avatar"
                      width="35"
                      height="35"
                      className="profile-circle-navbar"
                    />
                  }
                  id="user-nav-dropdown"
                  align="end"
                  
                >
                  <NavDropdown.Item as={Link} to="/myProfile">
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/myAppointments">
                    My Appointments
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/previousMedicineOrders">
                    Previous Medicine Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <div className="d-lg-none">{authNavItemsSmallScreen}</div>
            </>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
