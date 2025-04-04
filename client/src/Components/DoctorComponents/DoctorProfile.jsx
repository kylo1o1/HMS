import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Accordion } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../Axios/instance";
import Loading from "../../Pages/Others/Loading";
import { dateConvert, dateConvett, formatDateWithMoment } from "../../Utils/dateUtils";
import "./DoctorProfile.css";
import {
  fetchDoctorProfileFailure,
  fetchDoctorProfileSuccess,
  setLoading,
  updateDoctorProfileFailure,
  updateDoctorProfileSuccess,
} from "../../Redux/doctorSlice";
import { toast } from "react-toastify";


const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { doctorData, dataLoading, error } = useSelector((state) => state.doctorData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialImage,setInitialImage] = useState('')
  const [previewImage, setPreviewImage] = useState(
    doctorData?.docPicture || "/default-image.png"
  );
  
  const user = useSelector((state) => state?.auth?.user ?? {});
  const docId = user.id;

  useEffect(() => {
    if (docId) {
      const fetchDoctorProfile = async () => {
        dispatch(setLoading(true));
        try {
          const res = await instance.get("/doctor/profile", { withCredentials: true });
          if (res.data.success) {
            dispatch(fetchDoctorProfileSuccess(res.data.doctor));
          } else {
            dispatch(fetchDoctorProfileFailure(res.data.message || "Failed to fetch profile"));
          }
        } catch (error) {
          dispatch(fetchDoctorProfileFailure(error.message));
        }
      };

      fetchDoctorProfile();
    }
  }, [docId, dispatch]);

  useEffect(() => {
    if (doctorData?.userId) {
      const fileName = doctorData.docPicture?.split("\\").pop() ?? null;
      const imageUrl = fileName
        ? `${process.env.REACT_APP_URL}docProfiles/${fileName}`
        : "/media/96-969073_male-doctor-flat-icon-vector-doctor-vector-png.png";
      setPreviewImage(imageUrl);
      setInitialImage(imageUrl);
    }
  }, [doctorData]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.number().required("Required"),
    address: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    dateOfBirth: Yup.string().required("Required"),
    speciality: Yup.string().required("Required"),
    qualification: Yup.string().required("Required"),
    experience: Yup.number().required("Required"),
    about: Yup.string().required("Required"),
    appointmentCharges: Yup.string().required("Required"),
    pfp:Yup.mixed()
   
  });

  const basicInfoFields = [
    { label: "Email", name: "email", type: "email", className: "blue-text" },
    { label: "Phone", name: "phone", type: "number", className: "blue-text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
    { label: "Date of Birth", name: "dateOfBirth", type: "date" },
  ];

  const doctorInfoFields = [
    { label: "Speciality", name: "speciality", type: "text" },
    { label: "Qualification", name: "qualification", type: "text" },
    { label: "Experience (years)", name: "experience", type: "number" },
    { label: "Appointment Charges", name: "appointmentCharges", type: "text" },
  ];
  
  

    const onSubmit = async (values, { resetForm }) => {
      dispatch(setLoading(true));
    
      try {
        const formData = new FormData();
    
        const { phone, address, ...otherValues } = values;
        const contact = JSON.stringify({ phone, address });
    
        Object.entries(otherValues).forEach(([key, value]) => {
          if (key === "pfp" && value instanceof File) {
            formData.append("pfp", value);
          } else {
            formData.append(key, value);
          }
        });
    
        formData.append("contact", contact);
        
        const res = await instance.put("/doctor/update-profile", formData, { withCredentials: true });
        
        dispatch(setLoading())
        if (res.data.success) {
          toast.success("Profile Updated");
          dispatch(updateDoctorProfileSuccess(res.data.updatedDoctor));
          setIsEditMode(false);
          resetForm({ values });
          dispatch(updateDoctorProfileSuccess(res.data.updatedDoctor))
        } else {
          dispatch(updateDoctorProfileFailure(res.data.message || "Update failed"));
          toast.error("Update Failed");
          dispatch(updateDoctorProfileFailure(res.data.message))
        }
      } catch (error) {
        dispatch(updateDoctorProfileFailure(error.message));
        toast.error("Update Failed");
      }
    };
  

  const handleImageChange = (event, setFieldValue, setTouched) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); 
      };
      reader.readAsDataURL(file);
  
      setFieldValue("pfp", file); 
      setTouched("pfp", true); 
    }
  };
  

  const handleCancel = () => {
    setIsEditMode(false);
    setPreviewImage(initialImage);
  };

  if (error) return <p className="text-danger text-center">Failed to Load Page</p>;
  if (dataLoading) return <Loading />;

  return (
    <Container className="doctor-profile-container bg-transparent">
      <Row className="w-100">
        <Col sm={6} md={6} lg={9} xl={9} className="overflow-x-visible form-column">
          <Card className=" p-sm-2 border-0 bg-transparent">
            <Formik
              initialValues={{
                name: doctorData?.userId?.name || "",
                email: doctorData?.userId?.email || "",
                phone: doctorData?.userId?.contact?.phone || "",
                address: doctorData?.userId?.contact?.address || "",
                gender: doctorData?.userId?.gender || "",
                dateOfBirth: dateConvert(doctorData?.userId?.dateOfBirth) || "",
                speciality: doctorData?.speciality || "",
                qualification: doctorData?.qualification?.join(", ") || "",
                experience: doctorData?.experience || "",
                about: doctorData?.about || "",
                appointmentCharges: doctorData?.appointmentCharges || "",
                pfp:null
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ handleSubmit, resetForm, values, dirty,setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                  <Row className="align-items-center mb-3">
                    <Col xs={12} md={4} className="d-flex flex-column align-items-start gap-1">
                      <div className="doctor-avatar" onClick={() => isEditMode && document.getElementById("fileInput").click()}>
                        <img src={previewImage} className="w-100" alt="Profile" />
                      </div>
                      {isEditMode && <Field name="pfp">
                        {({ form: { setFieldValue, setTouched } }) => (
                          <>
                            <input
                              type="file"
                              id="fileInput"
                              className="d-none"
                              onChange={(event) => handleImageChange(event, setFieldValue, setTouched)}
                            />
                            <ErrorMessage name="pfp" component="div" className="text-danger" />
                          </>
                        )}
                      </Field>
                      }
                      {isEditMode ? ( 
                        <Form.Control type="text" name="name" value={values.name} />
                      ) : (
                        <p className="doc-profile-name mb-0 mt-3">{values.name}</p>
                      )}
                    </Col>
                  </Row>
                  <hr />

                  <Row>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <h6>Basic Information</h6>
                      {basicInfoFields.map(({ label, name, type, options, className }) => (
                        <Row key={name}>
                          <Col xs={5} sm={5} md={5}>
                            <p>{label}:</p>
                          </Col>
                          <Col xs={6} sm={6} md={7}>
                            {type === "date" ? (
                              isEditMode ? (
                                <Field name={name}>
                                  {({ field, form }) => (
                                    <Form.Control
                                      {...field}
                                      type="date"
                                      className={className}
                                      value={field.value || ""}
                                      onChange={(e) => form.setFieldValue(name, e.target.value)}
                                    />
                                  )}
                                </Field>
                              ) : (
                                <p className={`doc-highlight-text ${className}`}>
                                  {values[name] ? formatDateWithMoment(values[name]):""}
                                </p>
                              )
                            ) : isEditMode ? (
                              type === "select" ? (
                                <Field name={name} as={Form.Select}>
                                  <option value="">Select</option>
                                  {options.map((opt) => (
                                    <option key={opt} value={opt.toLowerCase()}>
                                      {opt}
                                    </option>
                                  ))}
                                </Field>
                              ) : type === "textarea" ? (
                                <Field as="textarea" name={name} rows={4} />
                              ) : (
                                <Field as={Form.Control} type={type} name={name} className={className} />
                              )
                            ) : (
                              <p className={`doc-highlight-text ${className}`}>{values[name] || "Not provided"}</p>
                            )}
                            <ErrorMessage name={name} component="div" className="text-danger" />
                          </Col>
                        </Row>
                      ))}

                    </Col>

                    <Col xs={12} sm={12} md={12} lg={6} className="mt-sm-3">
                      <h6>Doctor Information</h6>
                      {doctorInfoFields.map(({ label, name, type }) => (
                        <Row key={name}>
                          <Col xs={6} sm={5} md={5}>
                            <p>{label}:</p>
                          </Col>
                          <Col xs={6} sm={5} md={7} className=" d-flex justify-content-center">
                            {isEditMode ? (
                              <Field as={Form.Control} type={type} name={name} />
                            ) : (
                              <p className="doc-highlight-text">{name=== "appointmentCharges" && "₹"} {values[name] || "Not provided"}</p>
                            )}
                            <ErrorMessage name={name} component="div" className="text-danger" />
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>

                      

                  <div className="d-flex justify-content-start mt-3">
                    {isEditMode ? (
                      <>
                        <Button type="button" variant="secondary" className="me-2" onClick={()=>{handleCancel();resetForm({values:doctorData})}}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={!dirty}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button type="button" variant="primary" onClick={() => setIsEditMode(true)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorProfile;