import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Footer.css";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const links = [
    {
      title: "Quick Links",
      items: ["Pricing", "Features", "Medicines"],
    },
    {
      title: "Company",
      items: ["About Us", "Affiliates"],
    },
    {
      title: "Legal",
      items: ["Terms", "Acceptable Use", "Privacy Policy", "Cookie Policy", "Contact"],
    },
  ];

  return (
    <footer className="footer bg-dark text-light py-4">
      <Container>
        <Row className="gy-4 justify-content-between">
          {/* Links Section */}
          <Col md={4}>
            <Row>
              {links.map((section, index) => (
                <Col key={index} xs={6} sm={4}>
                  <div className="foot-links">
                    <h5>{section.title}</h5>
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>
                          <a href="#" className="footer-link">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Social Icons & Branding */}
          <Col md={5} className="text-md-end text-center">
            <div className="foot-icons">
              <a href="#" aria-label="Facebook" className="foot-icon">
                <FaFacebook size={30} />
              </a>
              <a href="#" aria-label="Instagram" className="foot-icon">
                <FaInstagram size={30} />
              </a>
            </div>
            <div className="brand-name">HealthSync</div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
