import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./Login.css"
import { Formik } from "formik";
import * as yup from 'yup';
import { Link } from "react-router-dom";
import instance from "../../Axios/instance";
import { Bounce, toast } from "react-toastify";

const LoginPage = () => {

  const handleLogin = async(val)=>{

    try {
      
      const res = await instance.post("/login",{
        email:val.email,
        password:val.password
      })
      if(res.data.success){
        toast('🦄 Login Success', {
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
        
      }else{
        console.error("errro");
        toast.error(res.message, {
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
      }

    } catch (error) {
      toast.error("Login Failed", {
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
      
      
    }

  }

  const schema =  yup.object().shape({
    email:yup.string().email().required("Please enter Email"),
    password:yup.string().required("Please enter Password")
  })
  return (
   
      <Container  className=" d-flex align-items-center justify-content-center">
        <Row className=" justify-content-sm-center justify-content-center ">
            <Col xxs={12} xs={12} sm={8} md={6} lg={4} className="login-wrapper mt-5 w-100 p-sm-4 justify-content-center">
               <div className="login-box   p-4 shadow rounded">
                    <header className="text-center mb-4">
                      <div><svg width="28" height="28" viewBox="0 0 92 92"><path fill="currentcolor" d="M64.0334418,3.00001993 C79.6854418,3.00001993 89.016442,12.3310199 88.9737367,27.9830199 L88.9737367,64.0170199 C88.9737367,79.6690199 79.6424418,89.0000199 63.9904418,89.0000199 L27.9994418,89.0000199 C12.347442,89.0000199 3.01644198,79.6690199 3.01644198,63.9740199 L3.01644198,27.9830199 C3.01644198,12.3310199 12.347442,3.00001993 27.9994418,3.00001993 L64.0334418,3.00001993 Z M32.6078468,17.0000199 C31.7278468,17.0000199 30.8478468,17.2400199 30.1278468,17.7200199 C29.3278468,18.2000199 28.7678468,18.8400199 28.4478468,19.6400199 C27.8878468,20.6000199 27.6478468,21.6400199 27.5678468,22.7600199 C27.5678468,23.8000199 27.4878468,24.9200199 27.4078468,25.9600199 L27.4078468,26.3600199 C27.3278468,29.9600199 27.2478468,32.6000199 27.2478468,36.4400199 L27.2478468,47.1600199 L27.0878468,58.7600199 C27.0878468,62.2000199 26.8478468,65.7200199 27.2478468,69.3200199 C27.2478468,69.8000199 27.4078468,70.3600199 27.5678468,70.8400199 C29.2478468,75.4000199 36.6078468,74.1200199 40.7678468,74.2800199 C45.1678468,74.3600199 49.3278468,74.3600199 53.4878468,74.2800199 L53.8078468,74.2800199 C55.0878468,74.1200199 56.3678468,74.1200199 57.5678468,74.0400199 C58.7678468,74.0400199 59.9678468,73.8000199 61.1678468,73.4000199 C62.0478468,73.0800199 62.6878468,72.6800199 63.2478468,71.9600199 C63.7278468,71.3200199 64.1278468,70.5200199 64.1278468,69.7200199 C64.1278468,69.0800199 64.1278468,67.8800199 63.9678468,67.3200199 C63.8078468,66.7600199 63.4878468,66.2800199 62.8478468,65.7200199 C62.5278468,65.4000199 62.0478468,65.0800199 61.4078468,64.9200199 C60.7678468,64.7600199 60.1278468,64.6000199 59.3278468,64.5200199 C58.6078468,64.4400199 57.8078468,64.3600199 57.1678468,64.3600199 L53.4078468,64.3600199 L37.5678468,64.2000199 L37.8878468,26.5200199 L37.8878468,25.0800199 C37.8878468,24.5200199 37.8878468,23.8800199 38.0478468,23.2400199 C38.0478468,22.6000199 37.8878468,21.9600199 37.8078468,21.2400199 C37.7278468,20.6000199 37.5678468,19.9600199 37.4078468,19.4800199 C37.1678468,18.9200199 36.8478468,18.4400199 36.5278468,18.1200199 C35.8878468,17.6400199 35.3278468,17.2400199 34.6878468,17.1600199 C34.0478468,17.0800199 33.3278468,17.0000199 32.6078468,17.0000199 Z" transform="rotate(7 45.995 46)"></path></svg>
                      </div>
                      <div className="fs-4 fw-bold" >Login</div>
                    </header>
                    <Formik
                      validationSchema={schema}
                      initialValues={{
                        email:"",
                        password:""
                      }}
                      onSubmit={handleLogin}

                    >
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                      <Form noValidate onSubmit={handleSubmit} className="login-form">
                          <Form.Group as={Col}  className="inputs">
                            <Form.FloatingLabel
                                    label="Email"
                                    className="mb-3">
                            <Form.Control
                              type="text"
                              name="email"
                              placeholder="email"
                              value={values.email}
                              onChange={handleChange}
                              isValid={touched.email && !errors.email}
                              isInvalid={!!errors.email}
                            >
                            </Form.Control>
                            </Form.FloatingLabel>

                          </Form.Group>
                          <Form.Group as={Col}  className="inputs">
                            <Form.FloatingLabel
                                    label="Password"
                                    className="mb-3">
                            <Form.Control
                              type="password"
                              name="password"
                              value={values.password}
                              placeholder="Password"
                              onChange={handleChange}
                              isValid={touched.password && !errors.password}
                              isInvalid={!!errors.password}
                            >
                            </Form.Control>
                            </Form.FloatingLabel>

                          </Form.Group>
                          <section>
                            <Button type="Submit" className="submit-btn" >
                              Login
                            </Button>
                          </section>
                      </Form>
                  )}
                    </Formik>
                    <div className="text-center mt-3">
                    <Link className="links d-block ">
                      Forgot Password?
                    </Link>
                    <Link className="links d-block " to={'/register'}>
                      New here?....Register now
                    </Link>
                    </div>
               </div>
            </Col>
        </Row>
    </Container>
   
  )
};

export default LoginPage;
