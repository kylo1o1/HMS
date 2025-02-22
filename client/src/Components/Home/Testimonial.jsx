import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Modal, Carousel } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "./Testimonial.css";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [review, setReview] = useState("");
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
  

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/testimonial/add", {
        fullName,
        email,
        country,
        state,
        review,
      }, { withCredentials: true });
      toast.success("Feedback submitted successfully!");
      setFullName("");
      setEmail("");
      setCountry("");
      setState("");
      setReview("");
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting feedback");
    }
  };

  return (
    <Container className="my-5">
      <Row className="align-items-center text-center text-md-start">
        <Col md={6} className="mb-4 what-they-say" >
          <h3 className="text-primary">Testimonial</h3>
          <h1 className="fw-bold">What They Say?</h1>
          <p>HealthSync has received more than <strong>10k positive ratings</strong> worldwide.</p>
          <p>Doctors and patients have greatly benefited from HealthSync.</p>
          <p>Have you? Please share your feedback.</p>
          <Button variant="outline-primary" onClick={() => setShowForm(true)}>Send Your Feedback →</Button>
        </Col>
        <Col md={6} className="testimonial-carousel">
        <Carousel fade interval={3000} controls={false} indicators={false}>
          {testimonials.map((testimonial, index) => (
            <Carousel.Item key={index}>
              <div className="testimonial-item">
                <p className="testimonial-text">"{testimonial.review}"</p>
                <h5 className="testimonial-name">- {testimonial.fullName}</h5>
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
          <Form onSubmit={handleFeedback}>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control as="textarea" rows={3} placeholder="Your Review" value={review} onChange={(e) => setReview(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Testimonials;
