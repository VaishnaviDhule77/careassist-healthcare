const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    reminderTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    frequency: {
      type: String,
      default: "Daily",
      enum: ["Daily", "Weekly", "As Needed"]
    },
    status: {
      type: String,
      enum: ["pending", "taken", "missed"],
      default: "pending"
    },
    lastReminderDate: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", medicationSchema);