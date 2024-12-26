exports.validateRequest = (extraFields, body) => {
  const commonFields = [
    "email",
    "password",
    "name",
    "dateOfBirth",
    "gender",
    "contact",
  ];

  const fields = [...commonFields, ...extraFields];
  

  for (const field of fields) {
    if (!body[field]) {
      return `${field} is required`;
    }
  }
  return null;
};
