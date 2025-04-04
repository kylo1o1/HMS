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
import { useLottie } from "lottie-react";

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
        const userRole = res.data.user.role;
                if (userRole === "Admin") {
                    navigate("/adminPanel");
                } else if (userRole === "Doctor") {
                    navigate("/docPanel");
                } else {
                    navigate("/");
                }
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

  const {View} = useLottie(defaultOptions)
  return (
    <Container fluid className="auth-container">
      <Row className="auth-wrapper">
        <Col md={6} className="auth-image-section d-none d-md-flex">
          <div className="lottie-container">
            {View}
          </div>
        </Col>
        <Col md={6} className="auth-form-section">
          <h1 className="auth-title">Welcome Back</h1>
          <h2 className="auth-title" style={{ fontSize: '1.5rem' }}>Login to Your Account</h2>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={schema}
            onSubmit={handleLogin}
          >
            {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
              <Form className="auth-form" onSubmit={handleSubmit}>
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

              <Button type="submit" className="auth-btn mt-4">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <p className="auth-link">
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
              <p className="auth-link">
                Forgot Password? <Link to="/forgot-password">Click Here</Link>
              </p>
              <p className="auth-link">
                <Link to={"/"}>Home</Link>
              </p>
            </Form>
            )}
            
          </Formik>
        </Col>
      </Row>
    </Container>

    
  );
};

export default Login;
