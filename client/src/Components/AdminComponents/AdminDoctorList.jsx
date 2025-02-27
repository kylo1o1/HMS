import React from "react";
import "./AdminDoctorList.css";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const DoctorCard = ({ doctor }) => {
  const fileName = doctor.docPicture?.split('\\').pop() ?? null;
  const imageUrl = fileName ? `${process.env.REACT_APP_URL}docProfiles/${fileName}` : "/media/96-969073_male-doctor-flat-icon-vector-doctor-vector-png.png";

  return (
    <Card className="doc-card px-0">
      <Card.Img
        variant="top"
        className="w-100 doc-img"
        src={imageUrl}
        alt={`Dr. ${doctor.userId?.name}`}
       
      />
      <Card.Body>
        <p className="text-center mb-2 doc-name">Dr. {doctor.userId?.name}</p>
        <div className="doctor-specialty">
          <Card.Text>{doctor.speciality}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

const AdminDoctorList = () => {
  const doctors = useSelector((state) => state?.dataSL?.doctors ?? []);

  return (
    <Container fluid className="admin-doc-list mt-3 ">
      <h1>All Doctors</h1>
      <Row className="admin-doc-row   gap-2 gap-0 row-gap-2 " >
        {doctors.map((doctor) => (
          <Col key={doctor._id} xs={5} sm={5} md={4} lg={3} xl={2} className="">
            <DoctorCard doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDoctorList;