import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../Axios/instance";
import Lottie from "react-lottie";
import animationData from "../../Lottie/Animation - 1739788656355.json";
import "./Auth.css";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../Redux/authSlice";

const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Enter email"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Enter password"),
   
  });

  const navigate = useNavigate();
  const disptach = useDispatch();
  const handleLogin = async (values) => {

    disptach(loginStart())
    try {
      const res = await instance.post("/login", values, { withCredentials: true });

      if (res.data.success) {
        
        toast.success("Login Successful");
        disptach(loginSuccess(res.data));
        localStorage.setItem("token",res.data.token);
        navigate("/");
      } else {
        toast.error(res.data.message || "Login Failed");
      }
    } catch (error) {
      toast.error("Invalid Credentials");
      disptach(loginFailure(error.res?.data) || "Login Failed")

    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Container fluid className="register-container">
      <Container>
        <Row className="register-wrapper align-items-center w-100">
          
          <Col md={6} className="register-image-section">
            <div className="register-image">
              <Lottie options={defaultOptions} height={450} width={450} />
            </div>
          </Col>
          <Col md={5} className="register-form-section ">
            <h1 className="register-title text-center">Welcome Back</h1>
            <h2 className="register-title text-center">Login to Your Account</h2>
            <Formik
              initialValues={{ email: "", password: "", confirmPassword: "" }}
              validationSchema={schema}
              onSubmit={handleLogin}
            >
              {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                <Form onSubmit={handleSubmit} className="login-form">
                  <Form.Group className="form-group">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          onChange={handleChange}
                          value={values.password}
                          isInvalid={touched.password && !!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>

                  

                  <Button variant="primary" type="submit" className="register-btn mt-4 w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                  <p className="register-login-link">
                    Don't have an account? <Link to="/register">Sign up</Link>
                  </p>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Login;
