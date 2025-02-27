import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl } from "react-bootstrap";
import "./MedicineList.css";
import MedicineCard from "../../Components/UserComponents/MedicineCard";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

const MedicineList = () => {
  const medicineForms = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Other"];
  const [selectedForm, setSelectedForm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate()
  const  {form} = useParams()
  useEffect(()=>{
    if(form) setSelectedForm(form);
  },[form])
  console.log(form);
  
 
  const medicines = useSelector((state) => state?.medicineSl?.medicines ?? []);

  const toggleSelect = (item) => {
    const newPath = item === selectedForm ? "/medicineList" : `/medicineList/${item}`;
    setSelectedForm(item === selectedForm ? "" : item);
    navigate(newPath);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchForm = selectedForm ? med.form === selectedForm : true;
    const matchSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchForm && matchSearch;
  });

  return (
    <Container fluid className="medicine-list-container">
      <Row className="d-block d-lg-none mb-3">
        <Col>
          <Button className="filter-toggle-btn" onClick={toggleFilters}>
            Filters
          </Button>
        </Col>
      </Row>

      <Row>
        <p className="text-center">Discover trusted medicines for your health.</p>
        {/* Sidebar for large screens */}
        <Col xs={12} lg={3} className="d-none d-lg-block">
          <div className="med-filter-sidebar">
            <h5>Search Medicines</h5>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search..."
                aria-label="Search Medicines"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroup.Text className="search-icon">
                <BiSearch size={20} />
              </InputGroup.Text>
            </InputGroup>
            <h5>Medicine Forms</h5>
            {medicineForms.map((form, index) => (
              <p
                key={index}
                className={`filter-item ${selectedForm === form ? "filter-selected" : ""}`}
                onClick={() => toggleSelect(form)}
              >
                {form}
              </p>
            ))}
          </div>
        </Col>

        {/* Mobile filters */}
        <Col xs={12} className={`d-lg-none ${showFilters ? "mobile-filter" : "d-none"}`}>
          <div className="med-filter-sidebar pt-0">
            <h5>Search Medicines</h5>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search..."
                aria-label="Search Medicines"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroup.Text className="search-icon">
                <BiSearch size={20} />
              </InputGroup.Text>
            </InputGroup>
            <h5>Medicine Forms</h5>
            {medicineForms.map((form, index) => (
              <p
                key={index}
                className={`filter-item ${selectedForm === form ? "filter-selected" : ""}`}
                onClick={() => toggleSelect(form)}
              >
                {form}
              </p>
            ))}
          </div>
        </Col>

        <Col xs={12} lg={showFilters ? 12 : 9}>
          <Row className="g-4">
            {filteredMedicines.map((medicine) => (
              <Col key={medicine._id} xs={12} sm={6} md={4} lg={3}>
                <MedicineCard medicine={medicine} link={`/medicine/${medicine._id}`} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default MedicineList;
