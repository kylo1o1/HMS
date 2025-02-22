import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import  *  as formik from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../Axios/instance";
import Lottie from "lottie-react";
import animationData from "../../Lottie/Animation - 1739788656355.json";
import "./Auth.css";

const Register = () => {
  const {Formik} = formik
  const schema = yup.object().shape({
    name: yup.string().required("Please enter your name"),
    email: yup.string().email("Invalid email").required("Enter email"),
    password: yup.string().required("Enter password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    dateOfBirth: yup.date().required("Enter DOB"),
    phone: yup.string().length(10, "Must be 10 digits").required("Enter phone"),
    address: yup.string().required("Enter address"),
    gender: yup.string().required("Select gender"),
  });

  const navigate = useNavigate();

  const handleRegister = async (values) => {
    console.log("Button Clicked", values);
    const {name,email,password,address,phone,dateOfBirth,gender} = values
    const contact = {address,phone}
    const data = {
      name,email,password,contact,dateOfBirth,gender
    }
    try {
      const res = await instance.post("/patient/register", data , {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Registration Success");
        navigate("/login");
      } else {
        toast.error("Registration Failed");
      }
    } catch (error) {
      toast.error("Registration Failed");
    }
  };

  return (
    <Container fluid className="register-container">
      <Row className="register-wrapper">
        <Col lg={6} className="register-image-section d-none d-lg-flex align-items-center justify-content-center">
          <div style={{ width: 400, height: 400 }}>
            <Lottie animationData={animationData} />
          </div>
        </Col>

        <Col lg={6} md={12} className="register-form-section">
          <Container className="register-container-2">
            <h2 className="register-title text-center">Sign Up</h2>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                gender: "",
                role: "",
                phone: "",
                address: "",
                dateOfBirth: "",
              }}
              validationSchema={schema}
              onSubmit={handleRegister} 
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                
                
                <Form noValidate   onSubmit={handleSubmit}
                  className="register-form">
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleChange}
                          value={values.name}
                          isInvalid={touched.name && !!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          onChange={handleChange}
                          value={values.email}
                          isInvalid={touched.email && !!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          onChange={handleChange}
                          value={values.address}
                          isInvalid={touched.address && !!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateOfBirth"
                          onChange={handleChange}
                          value={values.dateOfBirth}
                          isInvalid={touched.dateOfBirth && !!errors.dateOfBirth}
                        />
                        <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          onChange={handleChange}
                          value={values.phone}
                          isInvalid={touched.phone && !!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          isInvalid={touched.gender && !!errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          onChange={handleChange}
                          value={values.password}
                          isInvalid={touched.password && !!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          onChange={handleChange}
                          value={values.confirmPassword}
                          isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" variant="success"  className="register-btn mt-3 w-100">
                    Create Account
                  </Button>
                 
                  <p className="register-login-link text-center mt-3">
                    Already have an account? <Link to="/login">Sign in</Link>
                  </p>
                </Form>
                
              )}
              
            </Formik>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
