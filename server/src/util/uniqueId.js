const Appointments = require("../model/appointmentModel");
const Orders = require("../model/orderModel");

function generateRandomString(length) {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateUniqueId(type) {
  let prefix;
  let Model;

  if (type === 'appointment') {
    prefix = 'APPT-';
    Model = Appointments;
  } else if (type === 'order') {
    prefix = 'ORD-';
    Model = Orders;
  } else {
    throw new Error('Invalid type for ID generation');
  }

  let isUnique = false;
  let uniqueId;

  while (!isUnique) {
    uniqueId = prefix + generateRandomString(6);
    const existingRecord = await Model.findOne({ appointmentId: uniqueId }); // Common field name
    if (!existingRecord) {
      isUnique = true;
    }
  }

  return uniqueId;
}

module.exports = generateUniqueId;
