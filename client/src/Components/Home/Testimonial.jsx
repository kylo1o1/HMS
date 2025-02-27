import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Carousel } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import "./Testimonial.css";
import { BiRightArrow } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fakeTestimonials = [
      { fullName: "John Doe", review: "Amazing experience! HealthSync made my appointment process seamless." },
      { fullName: "Jane Smith", review: "Highly recommended! The doctors are very professional and caring." },
      { fullName: "Michael Brown", review: "A life-changing platform for managing my medical records easily." },
      { fullName: "Emily Johnson", review: "Fast and efficient service. Booking appointments was never this easy!" },
      { fullName: "David Wilson", review: "HealthSync is a game-changer in healthcare. Love the intuitive interface!" }
    ];
    setTestimonials(fakeTestimonials);
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      country: "",
      state: "",
      review: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      review: Yup.string().required("Review is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post("http://localhost:8000/api/v1/testimonial/add", values, { withCredentials: true });
        toast.success("Feedback submitted successfully!");
        resetForm();
        setShowForm(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error submitting feedback");
      }
    },
  });

  return (
    <Container fluid className="testimonial-container my-5">
      <Row className="align-items-center text-center text-md-start">
        <Col md={6} className="testimonial-content">
          <h3 className="testimonial-title">Testimonials</h3>
          <p>HealthSync has received more than <strong>10k positive ratings</strong> worldwide.</p>
          <p>Doctors and patients have greatly benefited from HealthSync.</p>
          <p>Have you? Please share your feedback.</p>
          <Button className="feedback-button" onClick={() => setShowForm(true)}>Send Your Feedback <FaArrowRight/></Button>
        </Col>
        <Col md={6}>
          <Carousel fade interval={3000} controls={false} indicators={false}>
            {testimonials.map((testimonial, index) => (
              <Carousel.Item key={index}>
                <div className="testimonial-box">
                  <p className="testimonial-text">"{testimonial.review}"</p>
                  <h5 className="testimonial-author">- {testimonial.fullName}</h5>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>

      {/* Modal Form for Feedback */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Your Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              {...formik.getFieldProps("fullName")}
              className={`form-control mb-3 ${formik.touched.fullName && formik.errors.fullName ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{formik.errors.fullName}</div>

            <input
              type="email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              className={`form-control mb-3 ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{formik.errors.email}</div>

            <input
              type="text"
              placeholder="Country"
              {...formik.getFieldProps("country")}
              className={`form-control mb-3 ${formik.touched.country && formik.errors.country ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{formik.errors.country}</div>

            <input
              type="text"
              placeholder="State"
              {...formik.getFieldProps("state")}
              className={`form-control mb-3 ${formik.touched.state && formik.errors.state ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{formik.errors.state}</div>

            <textarea
              rows="3"
              placeholder="Your Review"
              {...formik.getFieldProps("review")}
              className={`form-control mb-3 ${formik.touched.review && formik.errors.review ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{formik.errors.review}</div>

            <Button type="submit" className="w-100 ">Submit</Button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Testimonials;
