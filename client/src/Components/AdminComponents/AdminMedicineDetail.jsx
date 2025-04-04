import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./MedicineDetail.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../Pages/Others/Loading";
import { convertISODate, dateConvert, formatDateWithMoment } from "../../Utils/dateUtils";
import instance from "../../Axios/instance";
import { toast } from "react-toastify";
import { updateMedicineSuccess } from "../../Redux/medicineSlice";

const AdminMedicineDetail = () => {
    const [isEditMode, setIsEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(  "/default-medicine.png");
  const [initialImage, setInitialImage] = useState(  "");

  const cats = [
    "Analgesic", "Antibiotic", "Antihistamine", "Antipyretic",
    "Antidiabetic", "Cardiovascular", "Gastrointestinal", "Other"
  ]

  const forms = [
    "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Other"
  ]

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    stock: Yup.number().required("Required").min(0, "Cannot be negative"),
    price: Yup.number().required("Required").min(0, "Cannot be negative"),
    description: Yup.string().required("Required"),
    manufacturer: Yup.string().required("Required"),
    category: Yup.string().required("Required").oneOf(cats),
    form: Yup.string().required("Required").oneOf(forms),
    prescriptionRequired: Yup.boolean(),
    expiryDate: Yup.date().required("Required"),
    discount: Yup.number().min(0, "Cannot be negative").max(100, "Max 100%"),
    refilledAt: Yup.date()
  });

  const {medId} = useParams()

  const {medicines,loading,error} = useSelector((state)=> state?.medicineSl )

  const medicineData = medicines.find((item)=> item._id === medId)

  console.log(medicineData);
  

  useEffect(() => {
    if (medicineData?.image) {
        const fileName = medicineData.image?.split('\\').pop() ?? null;
        const imageUrl = fileName ? `${process.env.REACT_APP_URL}medicineImages/${fileName}` : "/media/96-969073_male-doctor-flat-icon-vector-doctor-vector-png.png";
      
      
      setPreviewImage(imageUrl);
      setInitialImage(imageUrl);
    }
    
  }, [medicineData]);

  console.log(isEditMode);
  
  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setFieldValue("image", file);
    }
  };

  const dispatch = useDispatch()

  const onSubmit = async (values, { resetForm }) => {
    if(!isEditMode){
        toast.error("Not In EditMode")
    }
    try {
        // dispatch(updateMed)
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("med", value);
        } else {
          formData.append(key, value);
        }
      });

      

      const res = await instance.put(`/medicine/${medicineData._id}`, formData,{withCredentials:true});
      if (res.data.success) {
        toast.success("Medicine Updated")
        setIsEditMode(false);
        dispatch(updateMedicineSuccess(res.data.medicine))
        resetForm({ values });
      }else{
        toast.error("Update Failed")
        setIsEditMode(false)
      }
    } catch (error) {
      toast.error("Update failed");
      console.error("Update failed:", error.message);
      setIsEditMode(false)


    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  const handleToggle = (event) => {
    event.preventDefault();
    setIsEditMode((prev) => !prev);
  };

  if (error) return <p className="text-danger">Failed to load medicine details</p>;
  if (loading) return <Loading />;

    return (
        <Container className="medicine-detail-container mt-5">
          <Row>
            <Col xs={12}>
              <Card className="p-3 p-md-4 medicine-detail-card">
                <Formik
                
                initialValues={{
                    name: medicineData.name || "",
                    stock: medicineData.stock || 0,
                    price: medicineData.price || 0,
                    description: medicineData.description || "",
                    manufacturer: medicineData.manufacturer || "",
                    category: medicineData.category || "Analgesic",
                    form: medicineData.form || "Tablet",
                    prescriptionRequired: medicineData.prescriptionRequired || false,
                    expiryDate: dateConvert(medicineData.expiryDate) || "",
                    discount: medicineData.discount || 0,
                    refilledAt: medicineData.refilledAt || ""
                  }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                
                >
                  {({ handleSubmit, values, setFieldValue,resetForm }) => (
                    <Form onSubmit={handleSubmit} noValidate  >
                      <Row className="mb-4">
                        <Col xs={12} md={4} className="mb-4 mb-md-0">
                          <div className="medicine-image-container text-center">
                            <img
                              src={previewImage}
                              alt="Medicine"
                              className="img-fluid medicine-image"
                              onClick={() => isEditMode && document.getElementById("imageInput").click()}
                            />
                            {isEditMode && (
                              <input
                                type="file"
                                id="imageInput"
                                hidden
                                onChange={(e) => handleImageChange(e, setFieldValue)}
                              />
                            )}
                          </div>
                          <div className="stock-status mt-2">
                            Status: {getStockStatus(values.stock)}
                          </div>
                        </Col>
    
                        <Col xs={12} md={8}>
                          <Row className="g-2 g-md-3">
                            <Col xs={12} sm={6}>
                              <Form.Group>
                                <Form.Label>Medicine Name</Form.Label>
                                {isEditMode ? (
                                  <Field name="name" as={Form.Control} />
                                ) : (
                                  <div className="value-display">{values.name}</div>
                                )}
                                <ErrorMessage name="name" component="div" className="text-danger" />
                              </Form.Group>
                            </Col>
    
                            <Col xs={12} sm={6}>
                              <Form.Group>
                                <Form.Label>Price (₹)</Form.Label>
                                {isEditMode ? (
                                  <Field name="price" type="number" as={Form.Control} />
                                ) : (
                                  <div className="value-display">₹{values.price}</div>
                                )}
                                <ErrorMessage name="price" component="div" className="text-danger" />
                              </Form.Group>
                            </Col>
    
                            {/* Stock and Discount */}
                            <Col xs={12} sm={6}>
                              <Form.Group>
                                <Form.Label>Stock Quantity</Form.Label>
                                {isEditMode ? (
                                  <Field name="stock" type="number" as={Form.Control} />
                                ) : (
                                  <div className="value-display">{values.stock}</div>
                                )}
                                <ErrorMessage name="stock" component="div" className="text-danger" />
                              </Form.Group>
                            </Col>
    
                            <Col xs={12} sm={6}>
                              <Form.Group>
                                <Form.Label>Discount (%)</Form.Label>
                                {isEditMode ? (
                                  <Field name="discount" type="number" as={Form.Control} />
                                ) : (
                                  <div className="value-display">{values.discount}%</div>
                                )}
                                <ErrorMessage name="discount" component="div" className="text-danger" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
    
                      {/* Additional Fields */}
                      <Row className="g-2 g-md-3">
                        <Col xs={12} md={6}>
                          <Form.Group>
                            <Form.Label>Manufacturer</Form.Label>
                            {isEditMode ? (
                              <Field name="manufacturer" as={Form.Control} />
                            ) : (
                              <div className="value-display">{values.manufacturer}</div>
                            )}
                            <ErrorMessage name="manufacturer" component="div" className="text-danger" />
                          </Form.Group>
                        </Col>
    
                        {/* Category and Form */}
                        <Col xs={12} sm={6} md={3}>
                          <Form.Group>
                            <Form.Label>Category</Form.Label>
                            {isEditMode ? (
                              <Field name="category" as="select" className="form-select">
                                {cats.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </Field>
                            ) : (
                              <div className="value-display">{values.category}</div>
                            )}
                          </Form.Group>
                        </Col>
    
                        <Col xs={12} sm={6} md={3}>
                          <Form.Group>
                            <Form.Label>Form</Form.Label>
                            {isEditMode ? (
                              <Field name="form" as="select" className="form-select">
                                {forms.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </Field>
                            ) : (
                              <div className="value-display">{values.form}</div>
                            )}
                          </Form.Group>
                        </Col>
    
                        {/* Dates */}
                        <Col xs={12} md={6}>
                          <Form.Group>
                            <Form.Label>Expiry Date</Form.Label>
                            {isEditMode ? (
                              <Field name="expiryDate" type="date" as={Form.Control} />
                            ) : (
                              <div className="value-display">
                                {convertISODate(values.expiryDate)}
                              </div>
                            )}
                            <ErrorMessage name="expiryDate" component="div" className="text-danger" />
                          </Form.Group>
                        </Col>
    
                        <Col xs={12} md={6}>
                          <Form.Group>
                            <Form.Label>Last Refilled</Form.Label>
                            {isEditMode ? (
                              <Field name="refilledAt" type="date" as={Form.Control} />
                            ) : (
                              <div className="value-display">
                                {values.refilledAt ? formatDateWithMoment(values.refilledAt) : "N/A"}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
    
                        {/* Description */}
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label>Description</Form.Label>
                            {isEditMode ? (
                              <Field name="description" as="textarea" rows={3} className="form-control" />
                            ) : (
                              <div className="value-display">{values.description}</div>
                            )}
                            <ErrorMessage name="description" component="div" className="text-danger" />
                          </Form.Group>
                        </Col>
    
                        {/* Prescription Required */}
                        <Col xs={12}>
                          <Form.Group className="d-flex align-items-center gap-2">
                            {isEditMode ? (
                              <Field 
                                name="prescriptionRequired" 
                                type="checkbox" 
                                className="form-check-input mt-0" 
                              />
                            ) : (
                              <input 
                                type="checkbox" 
                                className="form-check-input mt-0" 
                                checked={values.prescriptionRequired}
                                readOnly 
                              />
                            )}
                            <Form.Label className="mb-0">Prescription Required</Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
    
                      <div className="mt-4">
                        {isEditMode ? (
                          <div className="d-flex flex-column flex-sm-row gap-2">
                            <Button variant="primary" type="submit" className="flex-grow-1">
                              Save Changes
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={() => {
                                setIsEditMode(false);
                                setPreviewImage(initialImage);
                                setFieldValue("image",null);
                                resetForm({values:medicineData})
                                }
                              } 
                              className="flex-grow-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                         <div className="d-flex justify-content-center flex-sm-row gap-2">
                            <Button 
                            variant="success" 
                            onClick={handleToggle}
                            className="w-25 w-sm-auto"
                            type="button"
                          >
                            Edit Medicine
                          </Button>
                          <Button variant="danger" className="w-25 w-sm-auto">
                            Delete Medicine
                          </Button>
                         </div> 
                         
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

export default AdminMedicineDetail;



