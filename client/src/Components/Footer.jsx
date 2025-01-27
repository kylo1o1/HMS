import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import './Footer.css'

const Footer = () => {
  return (
    <Container fluid>
        <Row className="justify-content-around">
            <Col md={4}>
                <div className="d-flex justify-content-around">
                    <div className="foot-links">
                    <h5>Quick Links</h5>
                    <ul>
                        {["Pricing","Features","Medicines"].map((item)=>(
                            <li key={item}>
                                {item}
                            </li>
                        ))}
                    </ul>
                    </div>
                    <div className="foot-links">
                    <h5>Company</h5>
                    <ul>
                        {["About Us","Affiliates"].map((item)=>(
                            <li key={item}>
                                {item}
                            </li>
                        ))}
                    </ul>
                    </div>
                    <div className="foot-links">
                        <h5>Legal</h5>
                        <ul>
                            {["Terms","Acceptable Use","Privacy Policy","Cookie Policy","Contact"].map((item)=>(
                                <li key={item}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Col>
            <Col md={5} className="  d-flex justify-content-end" >
                <div >
                    <div className="d-flex justify-content-end foot-icons">
                        <div className="foot-icon">
                            <svg fill="#000000" width={"30px"} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
                                viewBox="-143 145 512 512" >
                            <g>
                                <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M272.8,560.7
                                    c-20.8,20.8-44.9,37.1-71.8,48.4c-27.8,11.8-57.4,17.7-88,17.7c-30.5,0-60.1-6-88-17.7c-26.9-11.4-51.1-27.7-71.8-48.4
                                    c-20.8-20.8-37.1-44.9-48.4-71.8C-107,461.1-113,431.5-113,401s6-60.1,17.7-88c11.4-26.9,27.7-51.1,48.4-71.8
                                    c20.9-20.8,45-37.1,71.9-48.5C52.9,181,82.5,175,113,175s60.1,6,88,17.7c26.9,11.4,51.1,27.7,71.8,48.4
                                    c20.8,20.8,37.1,44.9,48.4,71.8c11.8,27.8,17.7,57.4,17.7,88c0,30.5-6,60.1-17.7,88C309.8,515.8,293.5,540,272.8,560.7z"/>
                                <path d="M196.9,311.2H29.1c0,0-44.1,0-44.1,44.1v91.5c0,0,0,44.1,44.1,44.1h167.8c0,0,44.1,0,44.1-44.1v-91.5
                                    C241,355.3,241,311.2,196.9,311.2z M78.9,450.3v-98.5l83.8,49.3L78.9,450.3z"/>
                            </g>
                            </svg>
                        </div>
                        <div className="foot-icon">
                        <svg fill="#000000"  width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  
                                viewBox="-143 145 512 512" >
                            <g>
                                <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M272.8,560.7
                                    c-20.8,20.8-44.9,37.1-71.8,48.4c-27.8,11.8-57.4,17.7-88,17.7c-30.5,0-60.1-6-88-17.7c-26.9-11.4-51.1-27.7-71.8-48.4
                                    c-20.8-20.8-37.1-44.9-48.4-71.8C-107,461.1-113,431.5-113,401s6-60.1,17.7-88c11.4-26.9,27.7-51.1,48.4-71.8
                                    c20.9-20.8,45-37.1,71.9-48.5C52.9,181,82.5,175,113,175s60.1,6,88,17.7c26.9,11.4,51.1,27.7,71.8,48.4
                                    c20.8,20.8,37.1,44.9,48.4,71.8c11.8,27.8,17.7,57.4,17.7,88c0,30.5-6,60.1-17.7,88C309.8,515.8,293.5,540,272.8,560.7z"/>
                                <path d="M146.8,313.7c10.3,0,21.3,3.2,21.3,3.2l6.6-39.2c0,0-14-4.8-47.4-4.8c-20.5,0-32.4,7.8-41.1,19.3
                                    c-8.2,10.9-8.5,28.4-8.5,39.7v25.7H51.2v38.3h26.5v133h49.6v-133h39.3l2.9-38.3h-42.2v-29.9C127.3,317.4,136.5,313.7,146.8,313.7z"
                                    />
                            </g>
                            </svg>
                        </div>
                    </div>  
                    <div className="brand-name">
                                <p>BRANDNAME</p>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
  )
};

export default Footer;
