const { createTransport } = require("nodemailer");
const env = require("dotenv");
env.config();

const transport = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.E_PASS,
  },
});

const sendConfirmation = async (email, doctor, date, timeSlot) => {
  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "Appointment Confirmation",
    html: `
            <h3>Appointment Confirmed</h3>
            <p>Dear Patient,</p>
            <p>Your appointment with Dr ${doctor} has been successfully booked.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p>Thank you for choosing our hospital.</p>
        `,
  };

  try {
    await transport.sendMail(mailOption);
    console.log("Appointment email sent successfully");
  } catch (error) {
    console.error("Error sending appointment email:", error);
  }
};

const sendLoginInfo = async (email, password) => {
  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Login Details for the Hospital Management System",
    text: `
        Dear Doctor,
        \n\nYour Account has been Created Successfully,
        \nHere Are Your Login Credentials :
        \n\nEmail:${email},
        \n\nPassword:${password},
        \n\nPlease Login And change your password as soon as possible ,
        \n\nHMS admin
        `,
  };

  try {
    await transport.sendMail(mailOption);
    console.log("Login details email sent successfully");
  } catch (error) {
    console.error(error.message);
  }
};

const sendOtp = async (email, otp) => {
  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>Here is Your OTP for password Reset:</p>
      <centre><b>${otp}</b></centre>
    `,
  };

  try {
    await transport.sendMail(mailOption);

    console.log("OTP has been sent");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { sendConfirmation, sendLoginInfo, sendOtp };
