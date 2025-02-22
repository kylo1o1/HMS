import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./AddDoctor.css"
import { Formik } from "formik";
import * as yup from "yup"

const AddDoctor = () => {


    const [imagePreview,setPreviewImage] = useState(null)

    const fileInputRef = React.useRef()

    const schema = yup.object().shape({
        name: yup.string().required("Please enter Doctor's Name"),
        email: yup.string().email("Please enter a valid Email Address").required("Please enter Email Address"),
        gender: yup.string().required("Please select a Gender"),
        speciality: yup.string().required("Please enter Specialization"),
        qualification: yup.string().required("Please specify qualification"),
        experience: yup.number().required("Please enter Experience"),
        address: yup.string().required("Please enter Address"),
        about: yup.string(),
        password: yup
        .string()
        .required("Please enter Password")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
        phone: yup
        .string()
        .matches(/^\d{10}$/, "Please enter a valid 10-digit phone number")
        .required("Please enter Phone number"),
    });
    
    const handleImageClick = ()=>{
        fileInputRef.current.click()
    }



    const handleImageChange = (event)=>{

        const file = event.target.files[0]
        console.log("Selected File",file);
        if(file){
            const reader = new FileReader()
            reader.onloadend = ()=>{
            setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
        }
    }

  return (
    <Container fluid className="add-doc-container p-0 m-0">
       <Formik
        validationSchema={schema}
        initialValues={{
            name:"",
            email:"",
            gender:"",
            speciality:"",
            password:"",
            qualification:"",
            experience:"",
            phone:"",
            address:"",
            about:""
        }}
        onSubmit={console.log}
       >
        {({ handleSubmit, handleChange, values, touched, errors }) => (

        <Form noValidate  >
            <p className="add-doc-title">Add Doctor</p>
            <div className="add-doc-form-wrapper px-4 py-4">
                <div className="add-doc-image gap-4  mb-4">

                    <label htmlFor="pfp" onClick={handleImageClick} >
                    {imagePreview ?
                    <img src={imagePreview} alt="Preview" />:
                    <img src="/assets/admin/upload_area.svg" alt=" upload Here" />
                    }
                    <input type="file" 
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    />
                    </label>
                    <p>
                        Upload Doctor
                        <br />
                        Here
                    </p>
                </div>
                <Row className="other-fields">
                    <Col className="other-left d-flex flex-column gap-4">
                        <Col>
                            <p>Name</p>
                            <Form.Control 
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
    
                            />
                        </Col>
                        <Col>
                            <p>
                                Email
                            </p>
                            <Form.Control
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={values.email}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col>
                            <p>
                               Set Password
                            </p>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col>
                            <p>Experience</p>
                            <Form.Control
                                type="text"
                                name="experience"
                                value={values.experience}
                                onChange={handleChange}
                            />
                        </Col>
                    </Col>
                    <Col className="other-right">
                    </Col>
                </Row>
            </div>
        </Form>
        )}
       </Formik>
    </Container>
  )
};

export default AddDoctor;
