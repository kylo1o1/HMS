import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import instance from "../../Axios/instance";
import Lottie from "react-lottie";
import animationData from "../../Lottie/Animation - 1739788656355.json";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
    const [email, setEmail] = useState("");

    const navigate = useNavigate()

    const schema = yup.object().shape({
        email: step === 1 ? yup.string().email("Invalid email").required("Enter email") : yup.string(),
        otp: step === 2 ? yup.string().required("Enter OTP") : yup.string(),
        password: step === 3 ? yup.string().min(6, "Must be at least 6 characters").required("Enter password") : yup.string(),
        confirmPassword: step === 3
            ? yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password")
            : yup.string(),
    });

    const handleSubmit = async (values) => {
        if (step === 1) {
            try {
                const res = await instance.post("/send-otp", { email: values.email });
                if (res.data.success) {
                    toast.success("OTP sent!");
                    setEmail(values.email);
                    setStep(2);
                } else {
                    toast.error(res.data.message);
                }
            } catch {
                toast.error("Error sending OTP.");
            }
        } else if (step === 2) {
            try {
                const res = await instance.post("/verify-otp", { email, otp: values.otp });
                if (res.data.success) {
                    toast.success("OTP Verified!");
                    setStep(3);
                } else {
                    toast.error(res.data.message);
                }
            } catch {
                toast.error("Invalid OTP.");
            }
        } else if (step === 3) {
            try {
                const res = await instance.put("/reset-password", { email, newPassword: values.password });
                if (res.data.success) {
                    toast.success("Password Reset Successfully!");
                    navigate("/login")
                } else {
                    toast.error(res.data.message);
                }
            } catch {
                toast.error("Error resetting password.");
            }
        }
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
    };

    return (
        <Container fluid className="auth-container">
            <Row className="auth-wrapper">
                <Col md={6} className="auth-image-section d-none d-md-flex">
                    <div className="lottie-container">
                        <Lottie options={defaultOptions} />
                    </div>
                </Col>
                <Col md={6} className="auth-form-section">
                    <h1 className="auth-title">{step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Reset Password"}</h1>
                    <Formik initialValues={{ email: "", otp: "", password: "", confirmPassword: "" }} validationSchema={schema} onSubmit={handleSubmit}>
                        {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                            <Form className="auth-form" onSubmit={handleSubmit}>
                                {step === 1 && (
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
                                )}

                                {step === 2 && (
                                    <Form.Group className="form-group">
                                        <Form.Label>OTP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="otp"
                                            onChange={handleChange}
                                            value={values.otp}
                                            isInvalid={touched.otp && !!errors.otp}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.otp}</Form.Control.Feedback>
                                    </Form.Group>
                                )}

                                {step === 3 && (
                                    <>
                                        <Form.Group className="form-group">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                onChange={handleChange}
                                                value={values.password}
                                                isInvalid={touched.password && !!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                        </Form.Group>

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
                                    </>
                                )}

                                <Button type="submit" className="auth-btn mt-4">
                                    {isSubmitting ? "Processing..." : step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Link to={"/"} className="text-decoration-none "><p className="text-center mt-4">Go to Home</p></Link>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
