import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./AddDoctor.css"
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup"
import instance from "../../Axios/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addDoc, fetchDocFail, fetchDocStart, fetchDocSuccess } from "../../Redux/dataSlice";

const AddDoctor = () => {


    const [imagePreview,setPreviewImage] = useState(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()

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
        appointmentCharges:yup.number().required("Please Enter Fees"),
        pfp:yup.mixed(),
        password: yup
        .string()
        .required("Please enter Password"),
        phone: yup
        .string()
        .matches(/^\d{10}$/, "Please enter a valid 10-digit phone number")
        .required("Please enter Phone number"),
    });
    
    const doctorSpecialties = [
        "General Physician",
        "Cardiologist",
        "Neurologist",
        "Orthopedic Surgeon",
        "Pediatrician",
        "Dermatologist",
        "Ophthalmologist"
      ];
      
      

    const handleImageClick = ()=>{
        fileInputRef.current.click()
    }

   
    


    const onAddDoc = async (values) => {
        const formData = new FormData();

        const {
          name,
          email,
          appointmentCharges,
          password,
          speciality,
          qualification,
          about,
          gender,
          phone,
          address,
          dateOfBirth,
          experience,
          pfp
        } = values;
      
        const contact={address,phone}

        try {
          formData.append("name", name);
          formData.append("email", email);
          formData.append("appointmentCharges", appointmentCharges);
          formData.append("password", password);
          formData.append("speciality", speciality);
          formData.append("qualification", qualification);
          formData.append("about", about);
          formData.append("gender", gender);
          formData.append("experience",experience)
          formData.append("contact",contact)
          formData.append("dateOfBirth", dateOfBirth);
      
          
          if (pfp) {
            formData.append("pfp", pfp );
          }
      
        console.log(formData);
        
          const res = await instance.post('/admin/addNewDoctor',formData,{withCredentials:true})

          if (res.data.success) {
            toast.success("Doctor added successfully");
            dispatch(fetchDocStart());
            const refreshedRes = await instance.get('/admin/view-doctors', { withCredentials: true });
            if (refreshedRes.data.success) {
            dispatch(fetchDocSuccess({ doctors: refreshedRes.data.doctors }));
  }
            navigate('/adminPanel/doctor-list');
        } else {
            toast.error(res.data.error);
            dispatch(fetchDocFail())
        }
        
          console.log("Doctor added successfully:", formData);
        } catch (error) {
          toast.error(`Error adding doctor: ${error}` );
        }
      };
      

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
            about:"",
            appointmentCharges:"",
            dateOfBirth:"",
            pfp:null
        }}
        onSubmit={onAddDoc}
       >
        {({ handleSubmit, handleChange,setFieldValue, values, touched, errors }) => (

            <Form className="p-3 form-wrap" noValidate onSubmit={handleSubmit}>
            <p className="add-doc-title">Add Doctor</p>
            <div className="add-doc-form-wrapper px-4 py-4">
              <div className="add-doc-image gap-4 mb-4">
                <label htmlFor="pfp" onClick={handleImageClick}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <img src="/assets/admin/upload_area.svg" alt="Upload Here" />
                  )}
                  <input
                    type="file"
                    hidden
                    name="pfp"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                        setFieldValue("pfp", file);
                      }
                    }}
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
                    <div className="text-danger">
                      <ErrorMessage name="name" />
                    </div>
                  </Col>
                  <Col>
                    <p>Email</p>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="email" />
                    </div>
                  </Col>
                  <Col>
                    <p>Set Password</p>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="password" />
                    </div>
                  </Col>
                  <Col>
                    <p>Experience</p>
                    <Form.Control
                      type="text"
                      name="experience"
                      value={values.experience}
                      placeholder="Experience"
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="experience" />
                    </div>
                  </Col>
                  <Col>
                    <p>Appointment Charge</p>
                    <Form.Control
                      type="number"
                      name="appointmentCharges"
                      value={values.appointmentCharges}
                      placeholder="Fee"
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="appointmentCharges" />
                    </div>
                  </Col>
                </Col>
                <Col className="other-right d-flex flex-column gap-5">
                  <Col>
                    <p>Speciality</p>
                    <Form.Control
                      as="select"
                      name="speciality"
                      value={values.speciality}
                      onChange={handleChange}
                    >
                      <option value="">Select Speciality</option>
                      {doctorSpecialties.map((speciality) => (
                        <option key={speciality} value={speciality}>
                          {speciality}
                        </option>
                      ))}
                    </Form.Control>
                    <div className="text-danger">
                      <ErrorMessage name="speciality" />
                    </div>
                  </Col>
                  <Col>
                    <p>Qualification</p>
                    <Form.Control
                      type="text"
                      name="qualification"
                      value={values.qualification}
                      placeholder="Qualification"
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="qualification" />
                    </div>
                  </Col>
                  <Col>
                    <p>Gender</p>
                    {["Male", "Female", "Other"].map((gender) => (
                      <Form.Check
                        inline
                        key={gender}
                        type="radio"
                        label={gender}
                        name="gender"
                        value={gender}
                        checked={values.gender === gender}
                        onChange={() => setFieldValue("gender", gender)}
                      />
                    ))}
                    <div className="text-danger">
                      <ErrorMessage name="gender" />
                    </div>
                  </Col>
                  <Col>
                      <p>Date of Birth</p>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={values.dateOfBirth}
                        
                        onChange={handleChange}
                      />
                      <div className="text-danger">
                        <ErrorMessage name="dateOfBirth" />
                      </div>
                    </Col>
                  <Col>
                    <div>
                      <p>Address & Phone</p>
                      <Form.Control
                        type="text"
                        value={values.address}
                        placeholder="Address"
                        onChange={handleChange}
                        name="address"
                      />
                      <div className="text-danger">
                        <ErrorMessage name="address" />
                      </div>
                    </div>
                    <div className="mt-2">   
                      <Form.Control
                        type="number"
                        value={values.phone}
                        placeholder="Phone"
                        onChange={handleChange}
                        name="phone"
                      />
                      <div className="text-danger">
                        <ErrorMessage name="phone" />
                      </div>
                    </div>
                  </Col>
                </Col>
              </Row>
              <Row className="About-section mt-4">
                <Col>
                  <p className="mb-0">About</p>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Write About Doctor"
                    value={values.about}
                    name="about"
                    onChange={handleChange}
                  />
                  <div className="text-danger">
                    <ErrorMessage name="about" />
                  </div>
                </Col>
              </Row>
              <Button
                className="rounded-5 px-5 py-2 mt-4"
                type="submit"
              >
                Add Doctor
              </Button>
            </div>
          </Form>
        )}
       </Formik>
    </Container>
    
  )
};

export default AddDoctor;
