import React from "react";
import { Button, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import "./Register.css";
import instance from "../../Axios/instance";
import { Bounce, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const schema = yup.object().shape({
    name: yup.string().required("Please enter your name"),
    email: yup.string().email("Please enter a valid email address").required("Please enter your email address"),
    password: yup.string().required("Please enter your password"),
    dateOfBirth: yup.date().required("Please enter your date of birth"),
    phone: yup
      .string()
      .required("Please enter your phone number")
      .min(10, "Phone number must be exactly 10 digits")
      .max(10, "Phone number must be exactly 10 digits"),
    address: yup.string().required("Please enter your address"),
    gender: yup.string().required("Please select your gender"),
  });

  const navigate = useNavigate()

  const handleRegister = async (values) => {
    const { name, email, password, gender, phone, address, dateOfBirth } = values;

   

    const contact = { phone, address };

    try {
      const res = await instance.post(
        "/patient/register",
        { name, email, password, gender, dateOfBirth, contact},
        { withCredentials: true }
      );

      res.data.success
        ? toast.success('Registration Success', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          }) && navigate("/login")
          
        : toast.error("Registration Failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          });
        
    } catch (error) {
      toast.error("Registration Failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });    }
  };

  // Registration form UI
  return (
    <Container fluid className="outer-container">
      <Container className="form-wrapper">
        <Row className="justify-content-center align-items-center w-100">
          <Col md={5}>
            <div className="register-box">
              <h2 className="text-center mb-3">Registration</h2>
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  gender: "",
                  phone: "",
                  address: "",
                  dateOfBirth: "",
                }}
                validationSchema={schema}
                onSubmit={handleRegister}
              >
                {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                   <Row>
                   <FormGroup as={Col} className="mb-3">
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        isInvalid={touched.name && !!errors.name}
                      />
                      <ErrorMessage name="name" component="p" className="text-danger mb-0 " />
                    </FormGroup>
                    <FormGroup as={Col} className="mb-3">
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={touched.email && !!errors.email}
                      />
                      <ErrorMessage name="email" component="p" className="text-danger mb-0 " />
                    </FormGroup>
                   </Row>

                    
                  <Row>
                    <FormGroup as={Col} className="mb-3">
                      <FormLabel>Phone</FormLabel>
                      <FormControl
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        isInvalid={touched.phone && !!errors.phone}
                      />
                      <ErrorMessage name="phone" component="p" className="text-danger mb-0 " />
                    </FormGroup>

                    <FormGroup as={Col} className="mb-3">
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl
                        type="date"
                        name="dateOfBirth"
                        value={values.dateOfBirth}
                        onChange={handleChange}
                        isInvalid={touched.dateOfBirth && !!errors.dateOfBirth}
                      />
                      <ErrorMessage name="dateOfBirth" component="p" className="text-danger mb-0 " />
                    </FormGroup>
                    </Row>
                    <Row>
                    <FormGroup  as={Col} className="mb-3">
                      <FormLabel>Gender</FormLabel>
                      <div className="d-flex justify-content-around align-content-center">
                        {["Male", "Female", "Other"].map((gender) => (
                          <div className="d-flex me-3">
                            <FormCheck
                            key={gender}
                            inline
                            type="radio"
                            name="gender"
                            className="me-1"
                            value={gender}
                            onChange={handleChange}
                            checked={values.gender === gender}
                            isInvalid={touched.gender && !!errors.gender}
                          /><FormLabel>{gender}</FormLabel>
                          </div>
                          
                        ))}
                      </div>
                      <ErrorMessage name="gender" component="p" className="text-danger mb-0 " />
                    </FormGroup>
                    </Row>

                    {/* Address */}
                    <FormGroup className="mb-3">
                      <FormLabel>Address</FormLabel>
                      <FormControl
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        isInvalid={touched.address && !!errors.address}
                      />
                      <ErrorMessage name="address" component="p" className="text-danger mb-0 " />
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <FormLabel>Password</FormLabel>
                      <FormControl
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={touched.password && !!errors.password}
                      />
                      <ErrorMessage name="password" component="p" className="text-danger mb-0 " />
                    </FormGroup>

                    <div className="d-grid gap-2">
                      <Button variant="primary" type="submit" disabled={isSubmitting}>
                        Register
                      </Button>
                    </div>
                    <div className="text-center mt-3">
                      <Link to={'/login'} className="d-block">
                        Have An Account? Log In
                      </Link> 
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Register;
