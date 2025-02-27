import React from "react";
import "./AdminMedicineList.css";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const MedicineCard = ({ medicine }) => {
  const fileName = medicine.image?.split('\\').pop() ?? null;
  const imageUrl = fileName
    ? `${process.env.REACT_APP_URL}medicineImages/${fileName}`
    : "/media/default-medicine.png"; 

  return (
    <Card className="med-card h-100">
      <Card.Img
        variant="top"
        className="w-100 card-img-top"
        src={imageUrl}
        alt={medicine.name}
      />
      <Card.Body className="d-flex flex-column">
        <p className="text-start mb-2 med-name">{medicine.name}</p>
        <Card.Text className="med-category">
          <strong>Category:</strong> {medicine.category}
        </Card.Text>
        <Card.Text className="med-price">
          <strong>Price:</strong> ${medicine.price}
        </Card.Text>
        <Card.Text className="med-description">
          {medicine.description.substring(0, 60)}...
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const AdminMedicineList = () => {
  const medicines = useSelector((state) => state?.medicineSl?.medicines ?? []);
  
  return (
    <Container fluid className="admin-med-list">
      <h1>All Medicines</h1>
      <Row className="admin-med-row mt-4">
        {medicines.map((medicine) => (
          <Col key={medicine._id} xs={10} sm={5} md={4} lg={3} className="mb-4">
            <MedicineCard medicine={medicine} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminMedicineList;
