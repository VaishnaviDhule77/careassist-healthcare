const express = require("express");
const router = express.Router();
const HealthRecord = require("../models/HealthRecord");

router.post("/", async (req, res) => {
  try {
    const record = await HealthRecord.create(req.body);
    res.status(201).json({
      success: true,
      message: "Health record saved",
      record
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const records = await HealthRecord.find({
      patientId: req.params.patientId
    }).sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;