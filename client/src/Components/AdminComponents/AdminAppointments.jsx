import React, { useState } from "react";
import { Button, Container, Row, Col, Dropdown, Modal } from "react-bootstrap";
import "./AppointmentList.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { selectAdminHomeData } from "../../Redux/selectors/adminSelector";
import instance from "../../Axios/instance";
import { toast } from "react-toastify";
import { appUpdateStatusSuccess } from "../../Redux/adminAppoinments";

const getStatusBadge = (status) => {
  const statusInfo = {
    Completed: { color: "success", text: "This appointment is done." },
    Cancelled: { color: "danger", text: "This appointment was canceled." },
    Scheduled: { color: "warning", text: "This appointment is still pending." }
  };

  return (
    <span
      className={`status-pill bg-${statusInfo[status]?.color}`}
      title={statusInfo[status]?.text}
    >
      {status}
    </span>
  );
};


const AdminAppointments = () => {
  const appointmentsData = useSelector(state => state?.adminAppointmentData?.appData?.appointments);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleShowModal = (appointment, status) => {
    console.log(appointment);
    
    setSelectedAppointment(appointment);
    setNewStatus(status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setNewStatus("");
  };
  const dispatch = useDispatch()

  const handleUpdateStatus = async() => {
    try {

      const endpoint = newStatus === "Completed" ? "/appointments/completed" : "/appointments/cancel";
      const res = await instance.put(endpoint, { appointmentId: selectedAppointment._id }, { withCredentials: true });

      if(res.data.success){
        toast.success("Appointment Status Updated")
        dispatch(appUpdateStatusSuccess({ id: selectedAppointment._id, status: newStatus }));
      }
      else{
        throw new Error(res.data.message);  
      }
    } catch (error) {
      toast.error(error.message || "Failed To update Status")
    }    
    handleCloseModal();
  };

  if (!appointmentsData) return <p>Loading appointments...</p>;
  if (appointmentsData.length === 0) return <p>No appointments available.</p>;

  return (
    <Container fluid className="appointment-wrapper">
      <Row className="mt-3">
        <Col xs={12}><h5>Appointments</h5></Col>
      </Row>
      
      <div className="appointment-table-wrapper">
        <div className="appointment-table">
          <Row className="header-row">
            <Col xs={1}>#</Col>
            <Col xs={2}>Patient</Col>
            <Col xs={2}>Status</Col>
            <Col xs={3}>Date & Time</Col>
            <Col xs={2}>Doctor</Col>
            <Col xs={1}>Fees</Col>
            <Col xs={1}>Action</Col>
          </Row>
          {appointmentsData.map((appointment, index) => (
            <Row key={appointment.id} className="data-row">
              <Col xs={1}>{index + 1}</Col>
              <Col xs={2}>{appointment.patientId.name}</Col>
              <Col xs={2}>{getStatusBadge(appointment.status)}</Col>
              <Col xs={3}>{appointment.slotDate} {appointment.slotTime}</Col>
              <Col xs={2}>Dr. {appointment.doctorId.userId.name}</Col>
              <Col xs={1}>₹ {appointment.fee}</Col>
              <Col xs={1}>
                <Dropdown className={`${appointment.status === "Completed" || appointment.status === "Cancelled" ? 'd-none' : ""}`}>
                  <Dropdown.Toggle variant="light" className="action-btn">
                    <BsThreeDotsVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleShowModal(appointment, "Completed")}>
                      Mark as Completed
                    </Dropdown.Item>
                    <Dropdown.Item className="text-danger" onClick={() => handleShowModal(appointment, "Cancelled")}>
                      Cancel Appointment
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          ))}
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this appointment as <strong>{newStatus}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateStatus}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminAppointments;
