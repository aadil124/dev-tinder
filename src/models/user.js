const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      maxLength: 500,
      default: "This is a simple bio.",
    },

    skills: {
      type: [String],
      default: ["javascript"],
    },

    photoUrl: {
      type: String,
      default: "https://placehold.co/400x400?text=Profile",
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Generate JWT
userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
};

// Compare password
userSchema.methods.comparePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

module.exports = mongoose.model("User", userSchema);
