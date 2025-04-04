import React, { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {   cancelPatientAppointmentFailure, cancelPatientAppointmentSuccess,  fetchPatientAppointmentsFailure, fetchPatientAppointmentsStart, fetchPatientAppointmentsSuccess, updateAppnmtPaymentStatus } from "../../Redux/patientAppointments";
import instance from "../../Axios/instance";
import Loading from "../Others/Loading";
import './PatientAppointments.css'
import { formatDateWithMoment } from "../../Utils/dateUtils";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PatientAppointments = () => {
    const dispatch = useDispatch()

    const {appointments,loading,error} = useSelector((state)=> state?.patientAppointmentData)
    

    const handleCancellation = async (appointmentId) => {
        console.log(appointmentId);
        
        try {
            if(!appointmentId){
                toast.warn("ID is Required")
            }
            const res = await instance.put(`/appointments/cancel`,{appointmentId:appointmentId},{withCredentials:true})
            if(res.data.success){
                dispatch(cancelPatientAppointmentSuccess(appointmentId))
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
                dispatch(cancelPatientAppointmentFailure(res.data.message))
            }

        } catch (error) {
            toast.error("Failed To cancel Appointment")
            dispatch(cancelPatientAppointmentFailure(error.message))
        }
    }

    const handlePayment = async (appointmentId) => {
        try {
            
            const res = await instance.put(`/appointments/payment/${appointmentId}`,{},{withCredentials:true})
            if(res.data.success){
                
                toast.success("Payment Success")
                dispatch(updateAppnmtPaymentStatus(appointmentId))
            }else{
                throw new Error(res.data.message)
            }


        } catch (error) {
            toast.error(error.message || "Payment Failed")
        }
    }

    useEffect(()=>{
        const fetchUserAppointments = async () => {
            dispatch(fetchPatientAppointmentsStart())
            try {
                const res = await instance.get("/appointments/patientAppointments",{withCredentials:true})
                if(res.data.success){
                    dispatch(fetchPatientAppointmentsSuccess(res.data.appointments))
                }else{
                    dispatch(fetchPatientAppointmentsFailure(res.data.message))
                }
            } catch (error) {
                dispatch(fetchPatientAppointmentsFailure(error.message))
            }
        }
        fetchUserAppointments()
    },[dispatch])

    console.log(appointments);
    

    if(loading) return <Loading/>
    if(error) return <p className="text-danger-50 text-center text ">{error}</p>

    const AppointmentCard = ({appointment})=>{
        const {doctorId, slotDate, slotTime} = appointment;
        const fileName = doctorId.docPicture?.split("\\").pop();
        const imageUrl = fileName ? `${process.env.REACT_APP_URL}docProfiles/${fileName}` : "";

        return(
            <Card className="patient-appointment-card">
                <Row className="align-items-center">
                    {/* Image Column */}
                    <Col xs={4} md={2} className="text-center mb-3 mb-md-0">
                        <div className="appointment-doc-profile">
                            <img
                                src={imageUrl} 
                                alt="Doctor"
                                className="doctor-img"
                            />
                        </div>
                    </Col>

                    {/* Info Column */}
                    <Col xs={8} md={7} className="text-center text-md-start mb-3 mb-md-0">
                        <h5 className="doctor-name">{doctorId?.userId?.name || "N/A"}</h5>
                        <p className="specialization">{doctorId?.speciality || "N/A"}</p>
                        <p className="date-time">
                            <strong>Date:</strong> {formatDateWithMoment(slotDate)}<br className="d-md-none"/>
                            <span className="d-none d-md-inline"> | </span>
                            <strong>Time:</strong> {slotTime}
                        </p>
                    </Col>

                    {/* Action Buttons */}
                    <Col xs={12} md={3} className="text-md-end text-center">
                        {appointment.status !== "Cancelled" ? (
                            <>
                                <Button
                                 variant="outline-primary" 
                                 className={`mb-2 w-100 w-md-auto me-md-2 `}
                                 
                                 onClick={()=>handlePayment(appointment._id)}
                                 
                                 >
                                    Pay Online
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    className="w-100 w-md-auto"
                                    onClick={() => handleCancellation(appointment._id)}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline-danger disabled" className="w-100">
                                Cancelled
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card>
        )
    }

    return (
        <Container className="my-4">
            <h4 className="my-appointment-heading">My Appointments</h4>
            {appointments.length === 0 ? (
                <p className="text-center text-muted">No appointments yet.</p>
            ) : (
                appointments.map((appointment, index) => (
                    <AppointmentCard key={index} appointment={appointment} />
                ))
            )}
        </Container>
    );
};

export default PatientAppointments;