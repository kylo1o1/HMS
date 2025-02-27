import React from "react";
import { Container, Row } from "react-bootstrap";
import "./FindBySpeciality.css"
import { Link } from "react-router-dom";
const FindBySpeciality = () => {

    const specialities = [
        {name:"General Physician" ,img:"/media/General_physician.svg", path:"General Physician"},
        {name:"Gastroenterologist", img:"/media/Gastroenterologist.svg",path:"Gastroenterologist"},
        {name:"Gynecologist", img:"/media/Gynecologist.svg",path:"Gynecologist"},
        {name:"Neurologist", img:"/media/Neurologist.svg",path:"Neurologist"},
        {name:"Pediatricians", img:"/media/Pediatricians.svg", path:"Pediatricians"},
        {name:"Dermatologist", img:"/media/Dermatologist.svg", path:"Dermatologist"},
    ]

  return (

    <Container fluid id="speciality" className="find-by-speciality-wrap">
      <Row className="justify-content-center text-center">
            <h1>Find By Speciality</h1>
            <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            <div className="d-flex justify-content-center pt-4 px-0 gap-4">
            {specialities.map((speciality, index) => (
              
                <Link key={index} to={`/doctorList/${speciality.path}`} className="find-by-speciality-specialities">
                    <img src={speciality.img} alt={speciality.name} className="speciality-img" />
                    <p>{speciality.name}</p>
                </Link>
            ))}
            </div>
      </Row>
    </Container>

  );
};

export default FindBySpeciality;
