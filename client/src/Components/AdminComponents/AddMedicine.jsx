import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./AddMedicine.css";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import instance from "../../Axios/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMedFail, fetchMedStart, fetchMedSuccess } from "../../Redux/medicineSlice";

const AddMedicine = () => {
  const [imagePreview, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = React.useRef();

  const schema = yup.object().shape({
    name: yup.string().required("Please enter Medicine Name"),
    stock: yup
      .number()
      .required("Please enter Stock")
      .min(0, "Stock cannot be negative"),
    price: yup
      .number()
      .required("Please enter Price")
      .min(0, "Price cannot be negative"),
    description: yup.string().required("Please enter Description"),
    manufacturer: yup.string().required("Please enter Manufacturer"),
    category: yup.string().required("Please enter Category"),
    // You might want to use a select field for the form if you have predefined options
    form: yup.string().required("Please select the Medicine Form"),
    expiryDate: yup.date().required("Please enter Expiry Date"),
    image: yup.mixed().required("Please upload an Image"),
    discount: yup.number().min(0, "Discount cannot be negative"),
    refilledAt: yup.date(),
    prescriptionRequired: yup.boolean(),
  });

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const onAddMedicine = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();

    const {
      name,
      stock,
      price,
      description,
      manufacturer,
      category,
      form,
      expiryDate,
      image,
      discount,
      refilledAt,
      prescriptionRequired,
    } = values;

    formData.append("name", name);
    formData.append("stock", stock);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("manufacturer", manufacturer);
    formData.append("category", category);
    formData.append("form", form);
    formData.append("expiryDate", expiryDate);
    formData.append("medicineImage", image);
    if (discount) formData.append("discount", discount);
    formData.append("prescriptionRequired", prescriptionRequired);

    try {
      const res = await instance.post(
        "/medicine/add",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Medicine added successfully");
        dispatch(fetchMedStart());
        const refreshedRes = await instance.get('/medicine/viewAll', { withCredentials: true });
        if (refreshedRes.data.success) {
          dispatch(fetchMedSuccess( refreshedRes.data.medicines));
        }
        // navigate("/adminPanel/medicine-list");
      } else {
        toast.error(res.data.error);
        dispatch(fetchMedFail());
      }
    } catch (error) {
      toast.error(`Error adding medicine: ${error.message}`);
    } finally {
      setSubmitting(false);
      resetForm();
      setPreviewImage(null);
    }
  };

  return (
    <Container fluid className="add-medicine-container p-0 m-0">
      <Formik
        validationSchema={schema}
        initialValues={{
          name: "",
          stock: "",
          price: "",
          description: "",
          manufacturer: "",
          category: "",
          form: "",
          expiryDate: "",
          image: null,
          discount: "",
          refilledAt: "",
          prescriptionRequired: false,
        }}
        onSubmit={onAddMedicine}
      >
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          touched,
          errors,
          isSubmitting,
        }) => (
          <Form
            className="p-3 form-wrap"
            noValidate
            onSubmit={handleSubmit}
          >
            <p className="add-medicine-title">Add Medicine</p>
            <div className="add-medicine-form-wrapper px-4 py-4">
              <div className="add-medicine-image gap-4 mb-4">
                <label htmlFor="image" onClick={handleImageClick}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <img
                      src="/assets/admin/upload_area.svg"
                      alt="Upload Here"
                    />
                  )}
                  <input
                    type="file"
                    hidden
                    name="image"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                        setFieldValue("image", file);
                      }
                    }}
                  />
                </label>
                <p>
                  Upload Medicine
                  <br />
                  Here
                </p>
                <div className="text-danger">
                  <ErrorMessage name="image" />
                </div>
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
                    <p>Stock</p>
                    <Form.Control
                      type="number"
                      placeholder="Stock"
                      name="stock"
                      value={values.stock}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="stock" />
                    </div>
                  </Col>
                  <Col>
                    <p>Price</p>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="price" />
                    </div>
                  </Col>
                  <Col>
                    <p>Discount</p>
                    <Form.Control
                      type="number"
                      placeholder="Discount"
                      name="discount"
                      value={values.discount}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="discount" />
                    </div>
                  </Col>
                  <Col>
                    <p>Description</p>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="description" />
                    </div>
                  </Col>
                </Col>
                <Col className="other-right d-flex flex-column gap-4">
                  <Col>
                    <p>Manufacturer</p>
                    <Form.Control
                      type="text"
                      placeholder="Manufacturer"
                      name="manufacturer"
                      value={values.manufacturer}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="manufacturer" />
                    </div>
                  </Col>
                  <Col>
                    <p>Category</p>
                    <Form.Control
                      type="text"
                      placeholder="Category"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="category" />
                    </div>
                  </Col>
                  <Col>
                    <p>Form</p>
                    <Form.Control
                      as="select"
                      name="form"
                      value={values.form}
                      onChange={handleChange}
                    >
                      <option value="">Select Form</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Cream">Cream</option>
                      <option value="Other">Other</option>
                    </Form.Control>
                    <div className="text-danger">
                      <ErrorMessage name="form" />
                    </div>
                  </Col>
                  <Col>
                    <p>Expiry Date</p>
                    <Form.Control
                      type="date"
                      name="expiryDate"
                      value={values.expiryDate}
                      onChange={handleChange}
                    />
                    <div className="text-danger">
                      <ErrorMessage name="expiryDate" />
                    </div>
                  </Col>
                  
                  <Col>
                    <p>Prescription Required</p>
                    <Form.Control
                      as="select"
                      name="prescriptionRequired"
                      value={values.prescriptionRequired}
                      onChange={handleChange}
                    >
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </Form.Control>
                    <div className="text-danger">
                      <ErrorMessage name="prescriptionRequired" />
                    </div>
                  </Col>
                  
                </Col>
              </Row>
              <Button
                className="rounded-5 px-5 py-2 mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                Add Medicine
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddMedicine;
