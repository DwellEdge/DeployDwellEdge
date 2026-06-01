import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, default: "user" },
    loginHistory: [{ date: { type: Date, default: Date.now }, ip: String }],
  },
  { timestamps: true },
);

// remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
