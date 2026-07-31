const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    type: {
      type: String,
      enum: ["SOS", "MEDICATION", "MISSED_MEDICATION"],
      required: true
    },
    message: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    status: {
      type: String,
      enum: ["NEW", "SEEN", "RESOLVED"],
      default: "NEW"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);