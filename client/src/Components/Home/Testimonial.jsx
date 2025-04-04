import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Carousel, Form } from "react-bootstrap";
import { ErrorMessage, Field, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import "./Testimonial.css";
import { FaArrowRight } from "react-icons/fa";
import instance from "../../Axios/instance";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await instance.get("/testimonial");
        if (response.data.success) {
          setTestimonials(response.data.testimonials);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading testimonials");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const testimonialSubmit = async (values, { resetForm }) => {
    try {
      const response = await instance.post("/testimonial",values);
      
      if (response.data.success) {
        setTestimonials(prevTestimonials => [response.data.savedTestimonial, ...prevTestimonials]);
        console.log(testimonials);
        
        toast.success("Testimonial submitted successfully!");
        resetForm();
        setShowForm(false);
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Submission failed";
      console.log(errorMessage);
      
      toast.error(`${error.response?.data?.message}: ${errorMessage}`);
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    position: Yup.string().required("Position is required"),
    message: Yup.string().required("Message is required"),
    rating: Yup.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .required("Rating is required"),
  })

  return (
    <Container fluid className="testimonial-container my-5">
      <Row className="align-items-center text-center text-md-start">
        <Col md={6} className="testimonial-content">
          <h3 className="testimonial-title">Testimonials</h3>
          <p>HealthSync has received more than <strong>10k positive ratings</strong> worldwide.</p>
          <p>Doctors and patients have greatly benefited from HealthSync.</p>
          <p>Have you? Please share your feedback.</p>
          <Button className="feedback-button" onClick={() => setShowForm(true)}>
            Share Your Experience <FaArrowRight/>
          </Button>
        </Col>
        <Col md={6}>
          {loading ? (
            <div className="text-white">Loading testimonials...</div>
          ) : (
            <Carousel fade interval={3000} controls={false} indicators={false}>
              {testimonials.map((testimonial, index) => (
                <Carousel.Item key={index}>
                  <div className="testimonial-box">
                    <p className="testimonial-text">"{testimonial?.message}"</p>
                    <h5 className="testimonial-author">- {testimonial?.name}</h5>
                    <div className="text-muted">{testimonial?.position}</div>
                    <div className="rating">
                      {"★".repeat(testimonial?.rating)}{"☆".repeat(5 - testimonial?.rating)}
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Col>
      </Row>

      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share Your Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik
         initialValues={{ name: "", position: "", message: "", rating: "" }}
        validationSchema={validationSchema}
        onSubmit={testimonialSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            type="text"
            name="name"
            placeholder="Full Name"
            className={`form-control mb-3 ${touched.name && errors.name ? "is-invalid" : ""}`}
          />
          <ErrorMessage name="name" component="div" className="invalid-feedback" />

          <Field
            type="text"
            name="position"
            placeholder="Your Position"
            className={`form-control mb-3 ${touched.position && errors.position ? "is-invalid" : ""}`}
          />
          <ErrorMessage name="position" component="div" className="invalid-feedback" />

          <Field
            as="textarea"
            rows="3"
            name="message"
            placeholder="Your Experience"
            className={`form-control mb-3 ${touched.message && errors.message ? "is-invalid" : ""}`}
          />
          <ErrorMessage name="message" component="div" className="invalid-feedback" />

          <Field
            as="select"
            name="rating"
            className={`form-control testimonial-select mb-3 ${touched.rating && errors.rating ? "is-invalid" : ""}`}
          >
            <option value="">Select Rating</option>
            {[5, 4, 3, 2, 1].map(num => (
              <option key={num} value={num}>
                {num} Star{num !== 1 ? 's' : ''}
              </option>
            ))}
          </Field>
          <ErrorMessage name="rating" component="div" className="invalid-feedback" />

          <Button type="submit" className="w-100">Submit Experience</Button>
        </Form>
      )}
    </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Testimonials;