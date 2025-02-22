// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Button } from "react-bootstrap";
// import "./DoctorDetails.css";
// import instance from "../Axios/instance";
// import Loading from "../Pages/Others/Loading";
// import { BiInfoCircle } from "react-icons/bi";
// import { getNext7Days, getTimeRange } from "../Utils/timeAndDate";

// const DoctorDetails = () => {
//   const { id } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [days, setDays] = useState([]);
//   const [times, setTimes] = useState([]);
//   const [selectedTime, selectTime] = useState(null);
//   const [selectedDate, selectDate] = useState(null);

//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await instance.get(`/admin/view-doctors/${id}`, { withCredentials: true });
//         setDoctor(res.data.doctor);
//       } catch (err) {
//         setError("Failed to load doctor data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctor();
//     setDays(getNext7Days());
//     setTimes(getTimeRange(10, 20));
//   }, [id]);

//   const fileName = doctor?.docPicture?.split("\\").pop();
//   const imageUrl = `${process.env.REACT_APP_URL}docProfiles/${fileName}` || "N/A";

//   if (loading) return (
//     <Container className="doctor-profile-container mt-5 d-flex justify-content-center">
//       <Loading />
//     </Container>
//   );

//   if (error) return <p className="text-danger text-center">{error}</p>;

//   return (
//     <Container className="doctor-profile-container mt-5">
//       <Row className="align-items-center">
//         <Col xs={12} sm={12} md={4} lg={4} className="text-center doc-profile mb-3">
//           <img src={imageUrl} alt={doctor?.userId?.name} className="img-fluid rounded " />
//         </Col>
//         <Col xs={12} md={8} lg={8} className="overflow-y-auto doc-1-info align-self-start ">
//           <div className="doc-info">
//             <h2 className="doc-name">Dr. {doctor?.userId?.name}</h2>
//             <p className="doc-exp">{doctor?.qualification} - {doctor?.speciality}</p>
//             <p>{doctor?.experience} Years Experience</p>
//             <div className="doc-about-sec">
//               <p className="doc-about d-flex align-items-center gap-1 mb-2">
//                 About <BiInfoCircle size={18} />
//               </p>
//               <p className="doc-about-content">{doctor?.about || "No details available."}</p>
//             </div>
//             <p className="appointment-charge">Appointment Fee: <span className="fw-bold">₹{doctor?.appointmentCharges}</span></p>
//           </div>
//         </Col>
//       </Row>
//       <Row className="booking-Slots"> 
//         <p>Booking Slots</p>
//         <div className="  d-flex gap-4 overflow-x-scroll ">
//           {days.map((day, index) => (
//             <div key={index} className="d-flex  align-items-center justify-content-center">
//               <div 
//                 className={`book-day rounded-5 ${index === selectedDate ? "isActive" : ""}`} 
//                 onClick={() => selectDate(index)}
//               >
//                 <p>{day.shortDay}</p>
//                 <p>{day.date}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <p className="mb-0 mt-4">Time</p>
//         <div className="d-flex overflow-x-scroll time-range mt-4 gap-3">
//           {times.map((time, index) => (
//             <div 
//               key={index} 
//               className={`timeSlot ${selectedTime === index ? "isActive" : ""}`} 
//               onClick={() => selectTime(index)}
//             >
//               <p className="mb-0 mt-0">{time}</p>
//             </div>
//           ))}
//         </div>
//         <Button className="appointment-btn">Book An Appointment</Button>
//       </Row>
//     </Container>
//   );
// };

// export default DoctorDetails;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./DoctorDetails.css";
import instance from "../Axios/instance";
import Loading from "../Pages/Others/Loading";
import { BiInfoCircle } from "react-icons/bi";
import { getNext7Days, getTimeRange } from "../Utils/timeAndDate";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedTime, selectTime] = useState(null);
  const [selectedDate, selectDate] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await instance.get(`/admin/view-doctors/${id}`, { withCredentials: true });
        setDoctor(res.data.doctor);
      } catch (err) {
        setError("Failed to load doctor data");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
    setDays(getNext7Days());
    setTimes(getTimeRange(10, 20));
  }, [id]);

  const { userId, qualification, speciality, experience, about, appointmentCharges, docPicture } = doctor || {};
  const { name } = userId || {};
  const fileName = docPicture?.split("\\").pop();
  const imageUrl = fileName
    ? `${process.env.REACT_APP_URL}docProfiles/${fileName}`
    : "path/to/placeholder/image.jpg";

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const response = await instance.post(
        "/book-appointment",
        {
          doctorId: id,
          date: selectedDate,
          time: selectedTime,
        },
        { withCredentials: true }
      );
      alert("Appointment booked successfully!");
    } catch (err) {
      alert("Failed to book appointment. Please try again.");
    }
  };

  if (loading) return (
    <Container className="doctor-profile-container mt-5 d-flex justify-content-center">
      <Loading />
    </Container>
  );

  if (error) return (
    <Container className="doctor-profile-container mt-5">
      <p className="text-danger text-center">{error}</p>
    </Container>
  );

  return (
    <Container className="doctor-profile-container ">
      <Row className=" align-items-center align-content-sm-center  justify-content-md-center justify-content-xs-center  ">
        <Col xs={12} sm={1}  md={2} lg={4} className=" doc-profile mb-3 mb-md-1 ">
          <img src={imageUrl} alt={`Profile of Dr. ${name}`} className="img-fluid rounded" />
        </Col>
        <Col xs={12} sm={5} md={7} lg={8} className="overflow-y-auto doc-1-info align-self-start">
          <div className="doc-info">
            <h2 className="doc-name">Dr. {name}</h2>
            <p className="doc-exp">{qualification} - {speciality}</p>
            <p>{experience} Years Experience</p>
            <div className="doc-about-sec">
              <p className="doc-about d-flex align-items-center gap-1 mb-2">
                About <BiInfoCircle size={18} />
              </p>
              <p className="doc-about-content">{about || "No details available."}</p>
            </div>
            <p className="appointment-charge">Appointment Fee: <span className="fw-bold">₹{appointmentCharges}</span></p>
          </div>
        </Col>
      </Row>
      <Row className="booking-Slots  ms-lg-5 ms-md-2 ms-sm-0 ">
        <p>Booking Slots</p>
        <div className="d-flex gap-4 overflow-x-scroll">
          {days.map((day, index) => (
              <div
                className={`book-day rounded-5 d-flex justify-content-center  ${day.date === selectedDate ? "isActive" : ""}`}
                onClick={() => selectDate(day.date)}
              >
                <p>{day.shortDay}</p>
                <p>{day.date}</p>
              </div>
          ))}
        </div>
        <p className="mb-0 mt-4">Time</p>
        <div className="d-flex overflow-x-scroll time-range mt-4 gap-3">
          {times.map((time, index) => (
            <div
              key={index}
              className={`timeSlot ${time === selectedTime ? "isActive" : ""}`}
              onClick={() => selectTime(time)}
            >
              <p className="mb-0 mt-0">{time}</p>
            </div>
          ))}
        </div>
        <Button className="appointment-btn" onClick={handleBooking}>
          Book An Appointment
        </Button>
      </Row>
    </Container>
  );
};

export default DoctorDetails;
