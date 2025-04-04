import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./PatientProfile.css"; // Import external CSS
import { useSelector } from "react-redux";
import instance from "../../Axios/instance";
import Loading from "../Others/Loading";
import { dateConvert, formatDateWithMoment } from "../../Utils/dateUtils";

const PatientProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state?.auth?.user?? {});
  const pid = user.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
       
        const res = await instance.get(`/patient/profile`, { withCredentials: true });
        if (res.data.success) {
          setProfileData(res.data.patient);
        } else {
          setError(res.data?.message ?? "An error occurred while fetching profile data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (pid) {
      fetchProfile();
    }
  }, [user]);

  const userDetails = profileData.userId || {};

  console.log(profileData);
  
  
  const dateOfBirth = userDetails.dateOfBirth ? formatDateWithMoment(userDetails.dateOfBirth) : "";

  const initialValues = {
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    phone: userDetails?.contact?.phone || "",
    address: userDetails?.contact?.address || "",
    gender: userDetails?.gender || "",
    dateOfBirth: dateConvert(dateOfBirth) || ""
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.string().required("Birthday is required")
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const res = await instance.put("/patient/update-profile", values, { withCredentials: true });
      if (res.data.success) {
        setProfileData(res.data.updatedPatient);
        setIsEditMode(false);
        resetForm({ values });
      } else {
        setError(res.data?.message ?? "Failed to update profile");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-danger text-center">Failed To Load Page</p>;
  if (loading) return <Loading />;

  return (
    <Container className="mt-4 mb-4 patient-profile-container">
      <Row className="justify-content-start">
        <Col md={8} lg={6}>
          <Card className="p-4 border-0">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ handleSubmit, resetForm, values, dirty }) => (
                <Form onSubmit={handleSubmit}>
                  <Row className="align-items-center mb-3">
                    <Col xs={6} className="justify-content-start">
                      <div className="profile-avatar">
                        <img
                          src="/assets/admin/upload_area.png"
                          className="w-100"
                          alt="Profile"
                        />
                      </div>
                      {isEditMode ? (
                        <Field
                          name="name"
                          type="text"
                          as={Form.Control}
                          className="mt-3"
                        />
                      ) : (
                        <h4 className="mt-3 mb-0">{values.name}</h4>
                      )}
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </Col>
                  </Row>

                  <hr />

                  {/* Contact Information */}
                  <h6 className="text-muted mb-3 text-decoration-underline">
                    CONTACT INFORMATION
                  </h6>
                  <Row className="mb-2">
                    <Col xs={4}>
                      <strong>Email:</strong>
                    </Col>
                    <Col xs={8}>
                      {isEditMode ? (
                        <Field name="email" type="email" as={Form.Control} />
                      ) : (
                        <p className="highlight-text">{values.email}</p>
                      )}
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4}>
                      <strong>Phone:</strong>
                    </Col>
                    <Col xs={8}>
                      {isEditMode ? (
                        <Field name="phone" type="text" as={Form.Control} />
                      ) : (
                        <p className="highlight-text">{values.phone}</p>
                      )}
                      <ErrorMessage name="phone" component="div" className="text-danger" />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4}>
                      <strong>Address:</strong>
                    </Col>
                    <Col xs={8}>
                      {isEditMode ? (
                        <Field name="address" type="text" as={Form.Control} />
                      ) : (
                        <p className="text-muted mb-0">{values.address}</p>
                      )}
                      <ErrorMessage name="address" component="div" className="text-danger" />
                    </Col>
                  </Row>

                  <hr />

                  {/* Basic Information */}
                  <h6 className="text-muted">BASIC INFORMATION</h6>
                  <Row className="mb-2">
                    <Col xs={4}>
                      <strong>Gender:</strong>
                    </Col>
                    <Col xs={8}>
                      {isEditMode ? (
                        <Field name="gender" as="select" className="form-control">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Field>
                      ) : (
                        values.gender
                      )}
                      <ErrorMessage name="gender" component="div" className="text-danger" />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={4}>
                      <strong>Birthday:</strong>
                    </Col>
                    <Col xs={8}>
                      {isEditMode ? (
                        <Field name="dateOfBirth" type="date" as={Form.Control} />
                      ) : (
                        formatDateWithMoment(values.dateOfBirth)
                      )}
                      <ErrorMessage name="dateOfBirth" component="div" className="text-danger" />
                    </Col>
                  </Row>

                  {/* Edit/Save Button */}
                  <div className="d-flex justify-content-center mt-3">
                    {isEditMode ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          className="me-2"
                          onClick={() => {
                            resetForm();
                            setIsEditMode(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={!dirty}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        className="outline-danger"
                        onClick={() => {
                          resetForm({ values: initialValues });
                          setIsEditMode(true);
                        }}
                      >
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

export default PatientProfile;
