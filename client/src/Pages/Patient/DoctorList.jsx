import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./DoctorList.css";

const DoctorsList = () => {
  const doctors = useSelector((state) => state?.dataSL?.doctors ?? []);
  const navigate = useNavigate();
  const { speciality } = useParams();
  const [itemSelected, selectItem] = useState(speciality || "");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (speciality) selectItem(speciality);
  }, [speciality]);

  const doctorSpecialties = [
    "General Physician",
    "Cardiologist",
    "Neurologist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Dermatologist",
    "Ophthalmologist",
  ];

  const toggleSelect = (item) => {
    const newPath = item === itemSelected ? "/doctorList" : `/doctorList/${item}`;
    selectItem(item === itemSelected ? "" : item);
    navigate(newPath);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const DoctorCard = ({ doctor, id }) => {
    const fileName = doctor.docPicture?.split("\\").pop() ?? null;
    const imageUrl = fileName
      ? `${process.env.REACT_APP_URL}docProfiles/${fileName}`
      : "/media/96-969073_male-doctor-flat-icon-vector-doctor-vector-png.png";

    return (
      <Card className="doc-card card-for-patient px-0" onClick={() => navigate(`/appointment/${id}`)}>
        <Card.Img variant="top" className="w-100 doc-img" src={imageUrl} alt={`Dr. ${doctor.userId?.name}`} />
        <Card.Body>
          <p className="text-center mb-2 doc-name">Dr. {doctor.userId?.name}</p>
          <div className="doctor-specialty-patients d-flex justify-content-center">
            <Card.Text>{doctor.speciality}</Card.Text>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="mt-4 mb-5 doctor-list-container">
      <Row>
        <p className="text-center">Find the right doctor for your needs.</p>

        {/* Mobile Filters */}
        <Row className={`d-lg-none ${showFilters ? "mobile-filter" : "d-none"}`}>
          <Col xs={12}>
            <div className="doc-speciality-filter d-flex flex-column">
              {doctorSpecialties.map((item, index) => (
                <p
                  className={`mb-2 speciality-item ${itemSelected === item ? "speciality-selected" : ""}`}
                  key={index}
                  onClick={() => toggleSelect(item)}
                >
                  {item}
                </p>
              ))}
            </div>
          </Col>
        </Row>

        <Col xs={12} className="d-block d-lg-none mb-3">
          <Button className="filter-toggle-btn" onClick={toggleFilters}>Filters</Button>
        </Col>

        {/* Desktop Filters */}
        <Col xs={12} md={2} className={`doc-speciality-filter d-flex flex-column d-none d-lg-flex`}>
          {doctorSpecialties.map((item, index) => (
            <p
              className={`mb-2 speciality-item ${itemSelected === item ? "speciality-selected" : ""}`}
              key={index}
              onClick={() => toggleSelect(item)}
            >
              {item}
            </p>
          ))}
        </Col>

        <Col xs={12} lg={showFilters ? 12 : 10}>
          <div className="doc-cards-container">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doc-card-wrapper">
                <DoctorCard doctor={doctor} id={doctor._id} />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorsList;
