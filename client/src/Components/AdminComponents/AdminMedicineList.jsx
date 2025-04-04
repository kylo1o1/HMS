import React from "react";
import "./AdminMedicineList.css";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MedicineCard = ({ medicine }) => {
  const navigate = useNavigate();
  const fileName = medicine.image?.split('\\').pop() ?? null;
  const imageUrl = fileName
    ? `${process.env.REACT_APP_URL}medicineImages/${fileName}`
    : "/media/default-medicine.png";

  // Determine stock status and color
  const stock = medicine.stock || 0;
  let statusText;
  let statusColor;

  if (stock === 0) {
    statusText = 'Out of Stock';
    statusColor = '#dc3545'; // Red
  } else if (stock <= 10) {
    statusText = 'Low Stock';
    statusColor = '#ffc107'; // Orange
  } else {
    statusText = 'In Stock';
    statusColor = '#28a745'; // Green
  }

  return (
    <Card className="med-card " onClick={() => navigate(`/adminPanel/medicine-list/${medicine._id}`)}>
      <Card.Img
        variant="top"
        className="w-100  card-img-top"
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
        <Card.Text className="med-stock">
          <strong>Stock:</strong> {medicine.stock}
        </Card.Text>
        <Card.Text className="med-status" style={{ color: statusColor }}>
          <strong>Status:</strong> {statusText}
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
          <Col key={medicine._id} xs={11} sm={6} md={6} lg={4} xl={3} className="mb-4 d-flex justify-content-center">
            <MedicineCard medicine={medicine} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminMedicineList;