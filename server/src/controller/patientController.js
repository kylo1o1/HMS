const Patient = require("../model/patientModel");
const User = require("../model/userModel");
const { hashPassword } = require("../util/hashPassword");
const { validateRequest } = require("../util/validateRequest");

exports.addPatient = async (req, res) => {
  const role = "Patient";
  try {
    const { body } = req;

    const {
      name,
      email,
      password,
      gender,
      dateOfBirth,
      contact,
      ...additionalFields
    } = body;

    const requiredFields = ["insuranceDetails", "emergencyContact"];

    const validationError = validateRequest(requiredFields, body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Please Fill The form",
        error: validationError,
      });
    }

    console.log(additionalFields.insuranceDetails);
    

    const exPatient = await User.findOne({ email });

    if (exPatient) {
      return res.status(400).json({
        success: false,
        message: `${role} with this email already Exist!!`,
      });
    }

    const hashedPassword = await hashPassword(password);

    const commonFields = {
      name,
      email,
      password: hashedPassword,
      gender,
      contact,
      dateOfBirth,
      role
    };

    const user = await User.create({
        ...commonFields
    });

    const patient = await Patient.create({
        userId:user._id,
        ...additionalFields
    })

    

    return res.status(201).json({
        success:true,
        message:`${role} Registered !!`
    })

  } catch (error) {
    console.error("Patient registration error", error.message);
    return res.status(500).json({
      success: false,
      message: "Patient registration Error",
      error: error.message,
    });
  }
};
