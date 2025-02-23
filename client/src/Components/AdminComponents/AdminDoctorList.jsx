import React, { useEffect } from "react";
import "./AdminDoctorList.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";





const AdminDoctorList = () => {


  const doctors = useSelector((state) => state?.dataSL?.doctors ?? []);

    return (
    <Container fluid className="admin-doc-list" >
        <h1>All Doctors</h1>
        <Row className="gap-4 mt-4">
            {doctors.map((doctor)=>{
                 const fileName = doctor.docPicture?.split('\\').pop() ?? null;
                 const imageUrl = fileName ?( `${process.env.REACT_APP_URL}docProfiles/${fileName}`) :( "/media/96-969073_male-doctor-flat-icon-vector-doctor-vector-png.png");

                return (             
                        
                        //    <Col  className="d-flex justify-content-center">
                             <Card className=" doc-card px-0" >
                                <Card.Img variant="top" className="w-100" src={ imageUrl } alt={doctor?.userId?.name} />
                                <Card.Body>
                                <p className="text-center mb-2 doc-name">Dr. {doctor.userId?.name}</p>
                                <div className="doctor-specialty">
                                    <Card.Text> {doctor.speciality}</Card.Text>
                                </div>
                                </Card.Body>
                            </Card>
                            
                        //    </Col>
                    )
            }
            
            
           )}
        </Row>
    </Container>
  )
};

export default AdminDoctorList;
