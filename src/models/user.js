const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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
    password: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 100 },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    phoneNumber: { type: String, required: true },
    about: { type: String, maxLength: 500, default: "This is a simple bio." },
    skills: { type: [String], default: ["javascript"] },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/imgres?q=dummy%20profile%20photo&imgurl=https%3A%2F%2Fimg.magnific.com%2Fpremium-vector%2Fuser-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg%3Fsemt%3Dais_hybrid%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.magnific.com%2Ffree-photos-vectors%2Fuser-profile&docid=E9gUIi8-vaeUYM&tbnid=BTFPu8HcDI2G2M&vet=12ahUKEwj-0riHwdmXAxU_zzgGHZc1BwcQnPAOegUIswQQAA..i&w=740&h=740&hcb=2&ved=2ahUKEwj-0riHwdmXAxU_zzgGHZc1BwcQnPAOegUIswQQAA",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  return await bcrypt.compare(passwordInputByUser, hashedPassword);
};

module.exports = mongoose.model("User", userSchema);
