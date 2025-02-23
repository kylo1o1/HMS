import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import "./DoctorList.css";

const DoctorsList = () => {
  const navigate = useNavigate();
  const doctors = useSelector((state) => state?.dataSL?.doctors ?? []);

  

  return (
    <Container className="mt-4">
      <Row>
        {doctors.map((doctor) => {
          const fileName = doctor.docPicture?.split('\\').pop() ?? null;
          const imageUrl = fileName ?( `${process.env.REACT_APP_URL}docProfiles/${fileName}`) :("");
          return (
            <Col key={doctor._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="shadow doctor-card" onClick={() => navigate(`/doctorList/${doctor._id}`)}>
                <Card.Img variant="top" src={imageUrl || "/media/96-969073_male-doctor-flat-icon-vector-doctor-vector-png.png"} alt={doctor?.userId?.name} />
                <Card.Body>
                  <Card.Title className="doctor-title">{doctor?.userId.name}</Card.Title>
                  <div className="doctor-specialty">
                    <Card.Text>{doctor.speciality}</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default DoctorsList;
