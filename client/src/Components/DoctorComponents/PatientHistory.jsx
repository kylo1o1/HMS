import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiClock, FiDollarSign, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import instance from '../../Axios/instance';
import Loading from '../../Pages/Others/Loading';
import { convertISODate, formatDateWithMoment } from '../../Utils/dateUtils';
import { stringToColor, getInitials } from '../../Utils/helpers';
import './PatientHistory.css';
import { FaRupeeSign } from 'react-icons/fa';

const PatientHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await instance.get(`/doctor/patients/${patientId}/appointments`,{withCredentials:true});
        if (data.success) {
          setAppointments(data.appointments);
          setPatient(data.patient);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  if (loading) return <Loading skeletonCount={4} />;

  const getStatusVariant = (status) => {
    switch(status.toLowerCase()) {
      case 'scheduled': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };
  
  const getPaymentVariant = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="ph-container">
      <Button variant="light" className="ph-back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Patients
      </Button>

      {patient && (
        <Card className="ph-patient-card mb-4">
          <Card.Body>
            <div className="ph-patient-header">
              <div 
                className="ph-avatar"
                style={{ backgroundColor: stringToColor(patient.name) }}
              >
                {getInitials(patient.name)}
              </div>
              <div className="ph-patient-info">
                <h2>{patient.name}</h2>
                <div className="ph-patient-meta">
                  <span><FiCalendar /> DOB: {formatDateWithMoment(patient.dateOfBirth)}</span>
                  <span><FiClock /> Gender: {patient.gender}</span>
                  <span>📧 {patient.email}</span>
                  {patient.phone && <span>📱 {patient.phone}</span>}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Row className="g-4">
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <Col key={appointment._id} lg={6} xl={4}>
              <Card className="ph-appointment-card">
                <Card.Body>
                    <div className="ph-appointment-header d-flex ">
                    <div className="d-flex fle align-items-center gap-2">
                        <span className="ph-status-label">Status:</span>
                        <Badge pill className={`ph-status bg-${getStatusVariant(appointment.status)}`}>
                        {appointment.status}
                        {appointment.status === 'Scheduled' && <FiClock className="ms-2" />}
                        {appointment.status === 'Completed' && <FiCheckCircle className="ms-2" />}
                        {appointment.status === 'Cancelled' && <FiXCircle className="ms-2" />}
                        </Badge>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="ph-payment-label">Payment:</span>
                        <Badge pill className={`ph-payment bg-${getPaymentVariant(appointment.paymentStatus)}`}>
                        {appointment.paymentStatus}
                        {appointment.paymentStatus === 'Completed' && <FiCheckCircle className="ms-2" />}
                        {appointment.paymentStatus === 'Pending' && <FiClock className="ms-2" />}
                        </Badge>
                    </div>
                    </div>

                  <div className="ph-appointment-details">
                    <div className="ph-detail-item">
                      <FiCalendar className="ph-detail-icon" />
                      <div>
                        <small>Date: </small>
                        <strong>{formatDateWithMoment(appointment.slotDate)}</strong>
                      </div>
                    </div>
                    <div className="ph-detail-item">
                      <FiClock className="ph-detail-icon" />
                      <div>
                        <small>Time: </small>
                        <strong>{appointment.slotTime}</strong>
                      </div>
                    </div>
                    <div className="ph-detail-item">
                      <FaRupeeSign className="ph-detail-icon" />
                      <div>
                        <small>Fee: </small>
                        <strong>₹ {appointment.fee}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="ph-appointment-footer">
                    <small className="text-muted">
                      Created: {convertISODate(appointment.createdAt)}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <h4>No appointment history found</h4>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default PatientHistory;