const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    bloodPressure: { type: String, default: "" },
    heartRate: { type: Number, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);