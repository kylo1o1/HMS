import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import   "./AdmDefault.css";


const AdmDefault = () => {
  return(
    <Container className="adm-dashboard-wrap">
        <Row className=" gap-3">
            <Col sm={2} className="d-flex adm-default-columns gap-2">
                <div>
                    <img src="/assets/admin/doctor_icon.svg" alt="doc_icon" />
                </div>
                <div className="number-text">
                    <p className="adm-Number">
                        14
                    </p>
                    <p>
                        Doctors
                    </p>
                </div>
            </Col>
            <Col sm={2} className="d-flex adm-default-columns gap-2">
                <div>
                    <img src="/assets/admin/doctor_icon.svg" alt="doc_icon" />
                </div>
                <div className="number-text">
                    <p className="adm-Number">
                        14
                    </p>
                    <p>
                        Doctors
                    </p>
                </div>
            </Col>
            <Col sm={2} className="d-flex adm-default-columns gap-2">
                <div>
                    <img src="/assets/admin/doctor_icon.svg" alt="doc_icon" />
                </div>
                <div className="number-text">
                    <p className="adm-Number">
                        14
                    </p>
                    <p>
                        Doctors
                    </p>
                </div>
            </Col>
        </Row>
    </Container>
  )
};

export default AdmDefault;
