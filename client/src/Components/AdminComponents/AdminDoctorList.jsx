import React from "react";
import "./AdminDoctorList.css";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectAdminHomeData } from "../../Redux/selectors/adminSelector";

const DoctorCard = ({ doctor }) => {
  const fileName = doctor.docPicture?.split('\\').pop() ?? null;
  const imageUrl = fileName ? `${process.env.REACT_APP_URL}docProfiles/${fileName}` : "/media/96-969073_male-doctor-flat-icon-vector-doctor-vector-png.png";

  
  

  return (
    <Card className="adm-doc-card px-0">
      <Card.Img
        variant="top"
        className="w-100 adm-doc-img"
        src={imageUrl}
        alt={`Dr. ${doctor.userId?.name}`}
       
      />
      <Card.Body>
        <p className="text-center mb-2 adm-doc-name">Dr. {doctor.userId?.name}</p>
        <div className="doctor-specialty">
          <Card.Text>{doctor.speciality}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

const AdminDoctorList = () => {

  const { doctors } = useSelector(selectAdminHomeData);

  return (
    <Container fluid className="admin-doc-list mt-3">
      <h1>All Doctors</h1>
      <Row className="admin-doc-row g-2">
        {doctors.map((doctor) => (
          <Col 
            key={doctor._id} 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            xl={2}
          >
            <DoctorCard doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDoctorList;