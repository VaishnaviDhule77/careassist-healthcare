const express = require("express");
const router = express.Router();
const Medication = require("../models/Medication");
const Alert = require("../models/Alert");

router.post("/", async (req, res) => {
  try {
    const medication = await Medication.create(req.body);
    res.status(201).json({
      success: true,
      message: "Medication added successfully",
      medication
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const medications = await Medication.find({
      patientId: req.params.patientId
    }).sort({ reminderTime: 1 });

    res.json({ success: true, medications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication not found"
      });
    }

    res.json({ success: true, medication });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.patch("/:id/taken", async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { status: "taken" },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication not found"
      });
    }

    res.json({
      success: true,
      message: "Medication marked as taken",
      medication
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.patch("/:id/missed", async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { status: "missed" },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication not found"
      });
    }

    await Alert.create({
      patientId: medication.patientId,
      type: "MISSED_MEDICATION",
      message: `Missed medication: ${medication.medicineName} - ${medication.dosage}`
    });

    res.json({
      success: true,
      message: "Medication marked as missed",
      medication
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication not found"
      });
    }

    res.json({
      success: true,
      message: "Medication deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;