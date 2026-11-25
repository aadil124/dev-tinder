const validator = require("validator");
const mongoose = require("mongoose");

// ========================================
// EMAIL VALIDATION
// ========================================
const validateEmail = (email) => {
  return typeof email === "string" && validator.isEmail(email.trim());
};

// ========================================
// PASSWORD VALIDATION
// ========================================
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

// ========================================
// MONGODB OBJECT ID VALIDATION
// ========================================
const validateUserId = (userId) => {
  return mongoose.isValidObjectId(userId);
};

// ========================================
// PHOTO URL VALIDATION
// ========================================
const validatePhotoUrl = (photoUrl) => {
  if (typeof photoUrl !== "string") {
    return false;
  }

  const trimmedUrl = photoUrl.trim();

  if (!trimmedUrl || trimmedUrl.length > 2048) {
    return false;
  }

  return validator.isURL(trimmedUrl, {
    require_protocol: true,
    protocols: ["http", "https"],
    require_tld: true,
  });
};

// ========================================
// SKILLS VALIDATION
// ========================================
const validateSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return false;
  }

  // Allow empty array to clear existing skills
  if (skills.length > 5) {
    return false;
  }

  const normalizedSkills = [];

  for (const skill of skills) {
    if (
      typeof skill !== "string" ||
      skill.trim().length === 0 ||
      skill.trim().length > 30
    ) {
      return false;
    }

    normalizedSkills.push(skill.trim().toLowerCase());
  }

  // Prevent duplicate skills
  return new Set(normalizedSkills).size === normalizedSkills.length;
};

// ========================================
// NAME VALIDATION
// ========================================
const validateName = (name) => {
  return (
    typeof name === "string" &&
    name.trim().length >= 2 &&
    name.trim().length <= 50
  );
};

// ========================================
// ABOUT VALIDATION
// ========================================
const validateAbout = (about) => {
  return typeof about === "string" && about.trim().length <= 500;
};

// ========================================
// AGE VALIDATION
// ========================================
const validateAge = (age) => {
  return Number.isInteger(age) && age >= 18 && age <= 100;
};

// ========================================
// GENDER VALIDATION
// ========================================
const validateGender = (gender) => {
  return ["male", "female", "other"].includes(gender);
};

// ========================================
// PHONE NUMBER VALIDATION
// ========================================
const validatePhoneNumber = (phoneNumber) => {
  return (
    typeof phoneNumber === "string" && /^\+?[0-9]{10,15}$/.test(phoneNumber)
  );
};

// ========================================
// PROFILE UPDATE VALIDATION
// ========================================
const validateEditProfileData = (req) => {
  const updateData = req.body;

  const allowedFields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "photoUrl",
    "age",
    "gender",
    "phoneNumber",
  ];

  // Check request body
  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData) ||
    Object.keys(updateData).length === 0
  ) {
    return false;
  }

  // Check allowed fields
  const invalidFields = Object.keys(updateData).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return false;
  }

  // Validate firstName
  if (
    updateData.firstName !== undefined &&
    !validateName(updateData.firstName)
  ) {
    return false;
  }

  // Validate lastName
  if (updateData.lastName !== undefined && !validateName(updateData.lastName)) {
    return false;
  }

  // Validate about
  if (updateData.about !== undefined && !validateAbout(updateData.about)) {
    return false;
  }

  // Validate skills
  if (updateData.skills !== undefined && !validateSkills(updateData.skills)) {
    return false;
  }

  // Validate photoUrl
  if (
    updateData.photoUrl !== undefined &&
    !validatePhotoUrl(updateData.photoUrl)
  ) {
    return false;
  }

  // Validate age
  if (updateData.age !== undefined && !validateAge(updateData.age)) {
    return false;
  }

  // Validate gender
  if (updateData.gender !== undefined && !validateGender(updateData.gender)) {
    return false;
  }

  // Validate phoneNumber
  if (
    updateData.phoneNumber !== undefined &&
    !validatePhoneNumber(updateData.phoneNumber)
  ) {
    return false;
  }

  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUserId,
  validatePhotoUrl,
  validateSkills,
  validateName,
  validateAbout,
  validateAge,
  validateGender,
  validatePhoneNumber,
  validateEditProfileData,
};
