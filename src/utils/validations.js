const validator = require("validator");
const mongoose = require("mongoose");

// Validate email
const validateEmail = (email) => {
  return typeof email === "string" && validator.isEmail(email);
};

// Validate password
const validatePassword = (password) => {
  return (
    typeof password === "string" &&
    validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  );
};

// Validate MongoDB ObjectId
const validateUserId = (userId) => {
  return mongoose.isValidObjectId(userId);
};

// Validate update data
const validateUpdateData = (updateData) => {
  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    return {
      valid: false,
      message: "updateData must be a valid object",
    };
  }

  if (Object.keys(updateData).length === 0) {
    return {
      valid: false,
      message: "Update data cannot be empty",
    };
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "phoneNumber",
    "about",
    "skills",
    "photoUrl",
  ];

  const invalidFields = Object.keys(updateData).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return {
      valid: false,
      message: "Invalid fields provided",
      invalidFields,
    };
  }

  return {
    valid: true,
  };
};

// Validate skills
const validateSkills = (skills) => {
  return (
    Array.isArray(skills) &&
    skills.length >= 1 &&
    skills.length <= 5 &&
    skills.every(
      (skill) => typeof skill === "string" && skill.trim().length > 0,
    )
  );
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUserId,
  validateUpdateData,
  validateSkills,
};
