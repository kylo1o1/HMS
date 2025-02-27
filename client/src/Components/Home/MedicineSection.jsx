import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./MedicineSection.css"
import { Link } from "react-router-dom";
const MedicineSection = () => {
    const medicineForms = [
        {name:"Tablets",img:"/media/tablets-medicine-svgrepo-com.png"},
        {name:"Capsule",img:"/media/capsule-svgrepo-com.png"},
        {name:"Syrup",img:"/media/syrup-svgrepo-com.png"},
        {name:"Injection",img:"/media/injection-svgrepo-com.png"},
        {name:"Cream",img:"/media/cream-skin-svgrepo-com.png"},
        {name:"Other",img:"/media/other-svgrepo-com.png"}
    ]
      
      console.log(medicineForms);
        return (
    <Container className="medicine-Section">
            <Row className="justify-content-center text-center flex-column align-content-center">
                <Col md={6}>
                <h1>Find Medicines by Form</h1>
            <p>Select from Tablets, Capsules, Syrups, and more to get the right medicine, easily.</p>
            </Col>
                <Col md={6} className="d-flex pt-4 px-0 gap-4 justify-content-center align-content-center">
                
            {medicineForms.map((item)=>(
                <Link to={`/medicineList/${item.name}`} className="medicine-links">
                    <div className="medicine-types text-center">
                    
                    <img src={item.img} alt={item.name} className="" />
                    <p className="mt-2 mb-0">{item.name}</p>
                    
                </div>
                </Link>
            ))}
            </Col>

            </Row>
            
    </Container>
  )
};

export default MedicineSection;
