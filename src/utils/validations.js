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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "photoUrl",
    "age",
    "gender",
    "phoneNumber",
  ];

  const updateData = req.body;

  // Check empty request
  if (!updateData || Object.keys(updateData).length === 0) {
    return false;
  }

  // Check allowed fields
  const isEditAllowed = Object.keys(updateData).every((field) =>
    allowedEditFields.includes(field),
  );

  if (!isEditAllowed) return false;

  // Validate individual fields
  if (
    updateData.firstName !== undefined &&
    (typeof updateData.firstName !== "string" ||
      updateData.firstName.trim().length === 0)
  )
    return false;

  if (
    updateData.lastName !== undefined &&
    typeof updateData.lastName !== "string"
  )
    return false;

  if (updateData.about !== undefined && typeof updateData.about !== "string")
    return false;

  if (updateData.skills !== undefined && !validateSkills(updateData.skills))
    return false;

  if (
    updateData.photoUrl !== undefined &&
    typeof updateData.photoUrl !== "string"
  )
    return false;

  if (
    updateData.age !== undefined &&
    (!Number.isInteger(updateData.age) ||
      updateData.age < 18 ||
      updateData.age > 100)
  )
    return false;

  if (
    updateData.gender !== undefined &&
    !["male", "female", "other"].includes(updateData.gender)
  )
    return false;

  if (
    updateData.phoneNumber !== undefined &&
    typeof updateData.phoneNumber !== "string"
  )
    return false;

  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUserId,
  validateUpdateData,
  validateSkills,
  validateEditProfileData,
};
