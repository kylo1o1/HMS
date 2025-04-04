import React from "react";
import { Card, Col, Container, Row, Badge, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../Axios/instance";
import { toast } from "react-toastify";
import { updateAppointmentFailure, updateAppointmentStart, updateAppointmentSuccess } from "../../Redux/doctorAppoinments";
import { HiCheckCircle, HiXCircle, HiClock, HiUserCircle } from "react-icons/hi";
import "./DocAppointments.css";
import { formatDateWithMoment } from "../../Utils/dateUtils";
import { getInitials } from "../../Utils/helpers";
import { isToday } from "date-fns";
import { FaCalendarTimes, FaPlus } from "react-icons/fa";



const DocAppointments = () => {
  const { appointments } = useSelector((state) => state?.doctorAppointmentData);
  const dispatch = useDispatch();

  const handleCompletion = async (appointmentId) => {
    try {
      dispatch(updateAppointmentStart());
      const res = await instance.put("/appointments/completed", { appointmentId }, { withCredentials: true });
      if (res.data.success) {
        toast.success("Appointment Marked As Completed");
        dispatch(updateAppointmentSuccess(appointmentId));
      } else {
        toast.error("Failed To Change Status");
        dispatch(updateAppointmentFailure(res.data.message));
      }
    } catch (error) {
      toast.error("Failed To Change Status");
      dispatch(updateAppointmentFailure(error.message));
    }
  };
  
  const handleCancellation = async (appointmentId) => {
    try {
      dispatch(updateAppointmentStart());
      const res = await instance.put("/appointments/cancel", { appointmentId }, { withCredentials: true });
      if (res.data.success) {
        toast.success("Appointment Marked As Cancelled");
        dispatch(updateAppointmentSuccess(appointmentId));
      } else {
        toast.error("Failed To Change Status");
        dispatch(updateAppointmentFailure(res.data.message));
      }
    } catch (error) {
      toast.error("Failed To Change Status");
      dispatch(updateAppointmentFailure(error.message));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="status-badge bg-success"><HiCheckCircle /> Completed</Badge>;
      case "Cancelled":
        return <Badge className="status-badge bg-danger"><HiXCircle /> Cancelled</Badge>;
      default:
        return <Badge className="status-badge bg-warning text-dark"><HiClock /> Pending</Badge>;
    }
  };

  
  

  return (
    <Container className="appointments-container">
      <h4 className="mb-4 fw-bold text-primary">Upcoming Appointments</h4>
      <Row>
        {appointments.map((appointment) =>{ 
          const patientName = appointment?.patientId?.name || "N/A"
          const initials = getInitials(patientName)
          
          return (
          <Col xs={12} md={6} lg={4} key={appointment._id}>
            <Card className="appointment-card">
              <Card.Body>
                <div className="d-flex align-items-start">
                {initials ? (
                      <div className="initials-avatar">
                        {initials}
                      </div>
                    ) : (
                      <div className="patient-avatar">
                        <HiUserCircle className="icon" />
                      </div>
                    )}
                  <div className="appointment-details">
                    <h5 className="patient-name">{appointment?.patientId?.name || "N/A"}</h5>
                    <p className="appointment-time mb-2">
                      {formatDateWithMoment(appointment.slotDate)} • {appointment.slotTime}
                    </p>
                    <div className="d-flex align-items-center">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center pt-0">
                <span className="fees-text">₹ {appointment.fee}</span>
                {appointment.status === "Cancelled" || appointment.status === "Completed" ? (
                  <span className="text-muted small">No actions available</span>
                ) : (
                  <div className="action-buttons">
                    <Button 
                      variant="success" 
                      className="btn-complete d-flex align-items-center gap-1"
                      onClick={() => handleCompletion(appointment._id)}
                    >
                      <HiCheckCircle /> Complete
                    </Button>
                    <Button 
                      variant="danger" 
                      className="btn-cancel d-flex align-items-center gap-1"
                      onClick={() => handleCancellation(appointment._id)}
                    >
                      <HiXCircle /> Cancel
                    </Button>
                  </div>
                )}
              </Card.Footer>
            </Card>
          </Col>
        )})}
      </Row>
    </Container>
  );
};

export default DocAppointments;



