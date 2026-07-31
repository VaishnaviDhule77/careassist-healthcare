const express = require("express");
const router = express.Router();
const EmergencyContact = require("../models/EmergencyContact");

router.post("/", async (req, res) => {
  try {
    const contact = await EmergencyContact.create(req.body);
    res.status(201).json({
      success: true,
      message: "Emergency contact added",
      contact
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      patientId: req.params.patientId
    });

    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    res.json({
      success: true,
      message: "Emergency contact deleted"
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;