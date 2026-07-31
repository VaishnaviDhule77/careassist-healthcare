const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    bloodPressure: { type: String, default: "" },
    heartRate: { type: Number, default: null },
    bloodSugar: { type: Number, default: null },
    weight: { type: Number, default: null },
    oxygenLevel: { type: Number, default: null },
    temperature: { type: Number, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", healthRecordSchema);