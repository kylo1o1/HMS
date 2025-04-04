import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import "./DocPatients.css";
import Loading from "../../Pages/Others/Loading";
import { toast } from "react-toastify";
import instance from "../../Axios/instance";
import { FiUser, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { stringToColor, getInitials } from "../../Utils/helpers";
import { formatDateWithMoment } from "../../Utils/dateUtils";
import { useNavigate } from "react-router-dom";

const DocPatients = () => {
  const [patients, setPatients] = useState([]);
  const [fetching, setFetch] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await instance.get('/doctor/patients', { withCredentials: true });
        if (data.success) {
          setPatients(data.patients);
        } else {
          setError(data.message || 'Failed to load patients');
        }
      } catch (error) {
        toast.error(error.message);
        setError('Network error occurred');
      } finally {
        setFetch(false);
      }
    };
    fetchPatients();
  }, []);

  const getPatientStats = () => ({
    total: patients.length,
    completed: patients.reduce((sum, p) => sum + p.completed, 0),
    cancelled: patients.reduce((sum, p) => sum + p.cancelled, 0),
    totalAppointments: patients.reduce((sum, p) => sum + p.total, 0),
  });

  if (fetching) return <Loading skeletonCount={4} />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container fluid className="dp-container">
      <div className="dp-header">
        <div className="dp-header-content">
          <h1 className="dp-title">
            <FiUser className="dp-icon" />
            Patient Management
          </h1>
          <p className="dp-subtitle">Manage your patient relationships and appointments</p>
        </div>
        <div className="dp-stats">
          {[
            { label: "Total Patients", value: getPatientStats().total, icon: <FiUser /> },
            { label: "Completed Sessions", value: getPatientStats().completed, icon: <FiCheckCircle /> },
            { label: "Total Appointments", value: getPatientStats().totalAppointments, icon: <FiCalendar /> },
          ].map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      </div>

      <Row className="dp-list">
        {patients.length > 0 ? (
          patients.map((patient) => <PatientCard key={patient._id} patient={patient} />)
        ) : (
          <NoPatientsMessage />
        )}
      </Row>
    </Container>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="dp-stat-card">
    <div className="dp-stat-icon">{icon}</div>
    <div className="dp-stat-content">
      <h3>{value}</h3>
      <span>{label}</span>
    </div>
  </div>
);

const PatientCard = ({ patient }) => {
  const totalAppointments = patient.completed + patient.cancelled;
  const completedPercent = totalAppointments > 0 ? (patient.completed / totalAppointments) * 100 : 0;
  const cancelledPercent = totalAppointments > 0 ? (patient.cancelled / totalAppointments) * 100 : 0;
  const navigate = useNavigate()


  return (
    <Col lg={6} className="mb-4">
      <Card className="dp-card">
        <Card.Body>
          <div className="dp-card-header">
            <div className="dp-card-info">
              <div 
                className="dp-avatar"
                style={{ backgroundColor: stringToColor(patient.name) }}
              >
                {getInitials(patient.name)}
              </div>
              <div className="dp-meta">
                <h5 className="dp-name">
                  {patient.name}
                  <Badge pill className={`dp-status ${patient.active ? 'dp-active' : 'dp-inactive'}`}>
                    {patient.active ? 'Active' : 'Inactive'}
                  </Badge>
                </h5>
                <div className="dp-contacts">
                  <span className="dp-email">{patient.email}</span>
                  {patient.phone && <span className="dp-phone">{patient.phone}</span>}
                </div>
              </div>
            </div>
            <Button variant="link" onClick={()=>navigate(`/docPanel/patients/${patient._id}/appointments`)} className="dp-action">
              <FiClock /> History
            </Button>
          </div>

          <div className="dp-stats-section">
            <div className="dp-progress">
              <div className="dp-progress-labels">
                <span><FiCheckCircle /> Completed ({completedPercent.toFixed(1)}%)</span>
                <span><FiXCircle /> Cancelled ({cancelledPercent.toFixed(1)}%)</span>
              </div>
              <div className="dp-progress-bar">
                <div className="dp-progress-completed" style={{ width: `${completedPercent}%` }} />
                <div className="dp-progress-cancelled" style={{ width: `${cancelledPercent}%` }} />
              </div>
            </div>

            <div className="dp-metrics">
              <div className="dp-metric">
                <FiCalendar />
                <div>
                  <span>Last Appointment</span>
                  <strong>{formatDateWithMoment(patient.lastAppointment) || 'N/A'}</strong>
                </div>
              </div>
              <div className="dp-metric">
                <FiCheckCircle />
                <div>
                  <span>Success Rate</span>
                  <strong>{completedPercent.toFixed(1)}%</strong>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const NoPatientsMessage = () => (
  <Col className="dp-no-patients">
    <div className="dp-no-message">
      <FiUser className="dp-no-icon" />
      <h3>No Patients Found</h3>
      <p>Start by adding new patients through appointments</p>
      <Button variant="primary" className="mt-3">
        <FiCalendar className="me-2" />
        Schedule Appointment
      </Button>
    </div>
  </Col>
);

const ErrorMessage = ({ message }) => (
  <Col className="dp-error">
    <div className="dp-error-message">
      <FiXCircle className="dp-error-icon" />
      <h3>Error Loading Patients</h3>
      <p>{message}</p>
      <Button variant="secondary" onClick={() => window.location.reload()} className="mt-3">
        Try Again
      </Button>
    </div>
  </Col>
);

export default DocPatients;
