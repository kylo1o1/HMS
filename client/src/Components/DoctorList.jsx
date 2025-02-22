import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import instance from "../Axios/instance";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocFail, fetchDocStart, fetchDocSuccess } from "../Redux/dataSlice";
import "./DoctorList.css";

const DoctorsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state?.dataSL?.doctors ?? []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        dispatch(fetchDocStart());
        const res = await instance.get('/admin/view-doctors', { withCredentials: true });
        console.log(res.data.doctors);
        
        if (res.data.success) {
          dispatch(fetchDocSuccess({ doctors: res.data?.doctors }));
        } else {
          dispatch(fetchDocFail(res.data.error));
        }
      } catch (error) {
        dispatch(fetchDocFail(error.message));
      }
    };

    fetchDoctors();
  }, [dispatch]);

  return (
    <Container className="mt-4">
      <p></p>
      <Row>
        {doctors.map((doctor) => {
          const fileName = doctor.docPicture.split('\\').pop();
          const imageUrl = `${process.env.REACT_APP_URL}docProfiles/${fileName}`;
          return (
            <Col key={doctor._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="shadow doctor-card" onClick={() => navigate(`/doctorList/${doctor._id}`)}>
                <Card.Img variant="top" src={imageUrl} alt={doctor?.userId?.name} />
                <Card.Body>
                  <Card.Title className="doctor-title">{doctor?.userId.name}</Card.Title>
                  <div className="doctor-specialty">
                    <Card.Text>{doctor.speciality}</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default DoctorsList;
