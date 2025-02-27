import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./DoctorDetails.css";
import instance from "../../Axios/instance";
import Loading from "../Others/Loading";
import { BiInfoCircle } from "react-icons/bi";
import { getNext7Days, getTimeRange } from "../../Utils/timeAndDate";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateAppointmentFailure, updateAppointmentSuccess } from "../../Redux/appointment";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedTime, selectTime] = useState(null);
  const [selectedDate, selectDate] = useState({
    fullDay:null,
    shortDay:null,
    date:null,
    formattedDate:null
  });
  const [availableSlots,setAvailableSlots] = useState([]) 


  useEffect(() => {
    setLoading(true)
    const fetchDoctor = async () => {
      try {
        const res = await instance.get(`/admin/view-doctors/${id}`, { withCredentials: true });
        setDoctor(res.data.doctor);
        setLoading(false)
      } catch (err) {
        setError("Failed to load doctor data");
        setLoading(false)
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
    setDays(getNext7Days());
  }, [id]);

  if(doctor){
    console.log('here is doctor',doctor);
    
  }
    
 useEffect(()=>{
  if (!doctor || !doctor.shifts || !selectedDate) return; // Ensure doctor and shifts exist
  const timeRange = doctor.shifts.find((shift)=>(
    shift.day === selectedDate.fullDay
  ))
  if(timeRange){
    setAvailableSlots(getTimeRange(timeRange.startsAt,timeRange.endsAt))
  }else{
    setAvailableSlots([])
  }

  
 },[selectedDate,doctor])
  
 
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
 if (!doctor) return null; 
  const { userId, qualification, speciality, experience, about, appointmentCharges, docPicture } = doctor || {};
  const { name } = userId || {};
  const fileName = docPicture?.split("\\").pop();
  const imageUrl = fileName
    ? `${process.env.REACT_APP_URL}docProfiles/${fileName}`
    : "path/to/placeholder/image.jpg";

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.warn(`Please Select a ${  !selectedDate ? "Date " : !selectedTime ? "Time" : "Date & TIme" }` );
      return;
    }
    if (!doctor?._id) {
      toast.error("Doctor information is missing.");
      return;
    }
    const appointmentData = {
      doctorId:doctor._id || "",
      slotDate:selectedDate.formattedDate,
      slotTime:selectedTime
    }
    console.log(appointmentData);
    
    try {
      const res = await instance.post(
        "/appointments/book",
        appointmentData
        ,
        { withCredentials: true }
      );
      if(res.data.success){
        toast.success("Appointment booked successfully!");
        dispatch(updateAppointmentSuccess(res.data.appointment))
        navigate('/myAppointments')
      }else{
        toast.error("Booking Failed")
        dispatch(updateAppointmentFailure(res.data.message))
      }
    } catch (err) {
      toast.error("Failed to book appointment. Please try again.");
      dispatch(updateAppointmentFailure(error.message))

    }
  };

  if (loading) return (
    <Container className="doctor-profile-container  d-flex justify-content-center">
      <Loading />
    </Container>
  );

  if (error) return (
    <Container className="doctor-profile-container ">
      <p className="text-danger text-center">{error}</p>
    </Container>
  );

  
  

  return (
    <Container className="doctor-detail-container ">
      <Row className="align-items-start   doc-detail-first-row">
        <Col xs={8} sm={6} md={6} lg={4} className="doc-detail d-flex align-items-end  justify-content-center">
          <img
            src={imageUrl}
            alt={`Profile of Dr. ${name}`}
            className="rounded w-100"
          />
        </Col>

        <Col xs={12} sm={12} md={6} lg={8} className="doc-info">
          <h2 className="doc-name">Dr. {name}</h2>
          <div className="doc-exp">
            <p>
              {qualification} - {speciality}
            </p>
            <p>{experience} Years Experience</p>
          </div>
          <div className="doc-about-sec">
            <p className="doc-about d-flex align-items-center gap-1">
              About <BiInfoCircle size={18} />
            </p>
            <p className="doc-about-content">
              {about || "No details available."}
            </p>
          </div>
          <p className="appointment-charge">
            Appointment Fee:{" "}
            <span className="fw-bold">₹{appointmentCharges}</span>
          </p>
        </Col>
      </Row>

      <Row className="booking-Slots  mt-5 ">
        <p className="mb-0">Booking Slots</p>
        <div className="d-flex gap-4 day-date overflow-x-scroll">
          {days.map((day, index) => (
              <div
                key={index}
                className={`book-day rounded-5 d-flex justify-content-center  ${day.date === selectedDate.date ? "isActive" : ""}`}
                onClick={() => selectDate(day)}
              >
                <p>{day.shortDay}</p>
                <p>{day.date}</p>
              </div>
          ))}
        </div>
        <p className="mb-0 mt-4">Time</p>
            {!selectedDate.date ? (
              <p className="text-danger mt-4">Please select a date to view available slots.</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-danger mt-4">No slots available for the selected date.</p>
            ) : (
              <div className="d-flex overflow-x-scroll time-range mt-4 gap-3">
                {availableSlots.map((time, index) => (
                  <div
                    key={index}
                    className={`timeSlot ${time === selectedTime ? "isActive" : ""}`}
                    onClick={() => selectTime(time)}
                  >
                    <p className="mb-0 mt-0">{time}</p>
                  </div>
                ))}
              </div>
            )}
        <Button className="appointment-btn" onClick={handleBooking}>
          Book An Appointment
        </Button>
      </Row>
    </Container>
  );
};

export default DoctorDetails;