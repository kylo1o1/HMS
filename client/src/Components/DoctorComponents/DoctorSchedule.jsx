import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { FaClock, FaEdit } from "react-icons/fa";
import "./DoctorSchedule.css";
import instance from "../../Axios/instance";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleFailure, fetchScheduleSuccess, setScheduleLoading, setUpdateLoading, updateScheduleFailure, updateScheduleSuccess } from "../../Redux/schedule";

const DoctorSchedule = () => {
     
      
  const dispatch = useDispatch();
  const { schedule, scheduleLoading, scheduleError, updateLoading } = useSelector((state) => state.scheduleData);
  const [showModal, setShowModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);


  useEffect(() => {
    const fetchSchedule = async () => {
      dispatch(setScheduleLoading());
      try {
        const res = await instance.get("/doctor/schedule", { withCredentials: true });
        if (res.data.success) {
          dispatch(fetchScheduleSuccess(res.data.shifts));
        } else {
          dispatch(fetchScheduleFailure("Failed to fetch schedule"));
        }
      } catch (error) {
        dispatch(fetchScheduleFailure(error.message));
      }
    };
    fetchSchedule();
  }, [dispatch]);

  const handleEdit = (index) => {
    setSelectedShift({ ...schedule[index], index });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelectedShift({ ...selectedShift, [e.target.name]: e.target.value });
  };

  const toggleOffDay = () => {
    setSelectedShift({
      ...selectedShift,
      startsAt: selectedShift.startsAt === "" ? "09:00" : "",
      endsAt: selectedShift.endsAt === "" ? "17:00" : "",
    });
  };

  const handleSave = async () => {
    dispatch(setUpdateLoading());
    const updatedSchedule = [...schedule];
    updatedSchedule[selectedShift.index] = {
      day: selectedShift.day,
      startsAt: selectedShift.startsAt,
      endsAt: selectedShift.endsAt,
    };

    try {
      const res = await instance.put("/doctor/update-schedule", { shifts: updatedSchedule }, { withCredentials: true });
      if (res.data.success) {
        dispatch(updateScheduleSuccess(updatedSchedule));
        setShowModal(false);
      } else {
        dispatch(updateScheduleFailure("Update failed"));
      }
    } catch (error) {
      dispatch(updateScheduleFailure(error.message));
    }
  };

  console.log(schedule);
  

  return (
    <Container className="doctor-schedule-container mt-4">
      <h3 className="text-center mb-4">Doctor Work Schedule</h3>
      {scheduleLoading ? (
        <p className="text-center">Loading schedule...</p>
      ) : scheduleError ? (
        <p className="text-danger text-center">{scheduleError}</p>
      ) : (
        <Row className="justify-content-center">
          {schedule.map((shift, index) => (
            <Col xs={6} md={6} lg={4} key={index} className="mb-3">
              <Card className="schedule-card">
                <Card.Body>
                  <Card.Title className="text-center">{shift.day}</Card.Title>
                  <hr />
                  {shift.startsAt && shift.endsAt ? (
                    <p className="shift-time">
                      <FaClock className="clock-icon" /> {shift.startsAt} - {shift.endsAt}
                    </p>
                  ) : (
                    <p className="text-danger text-center">Off Day</p>
                  )}
                  <Button variant="outline-primary" className="edit-btn w-100 mt-2" onClick={() => handleEdit(index)}>
                    <FaEdit /> Edit Shift
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Shift for {selectedShift?.day}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startsAt"
                value={selectedShift?.startsAt}
                onChange={handleChange}
                disabled={selectedShift?.startsAt === ""}
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endsAt"
                value={selectedShift?.endsAt}
                onChange={handleChange}
                disabled={selectedShift?.endsAt === ""}
              />
            </Form.Group>
            <Button
              variant={selectedShift?.startsAt === "" ? "success" : "danger"}
              className="mt-3"
              onClick={toggleOffDay}
            >
              {selectedShift?.startsAt === "" ? "Remove Off Day" : "Set as Off Day"}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={updateLoading}>
            {updateLoading ? "Updating..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DoctorSchedule;
