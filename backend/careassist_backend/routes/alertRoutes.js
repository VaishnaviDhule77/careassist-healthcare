const express = require("express");
const router = express.Router();

const Alert = require("../models/Alert");
const EmergencyContact = require("../models/EmergencyContact");

router.post("/sos", async (req, res) => {
  try {
    const { patientId, latitude, longitude } = req.body;

    if (!patientId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "patientId, latitude and longitude are required"
      });
    }

    const alert = await Alert.create({
      patientId,
      type: "SOS",
      message: "Emergency SOS activated by patient",
      latitude,
      longitude
    });

    const contacts = await EmergencyContact.find({ patientId });

    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    contacts.forEach((contact) => {
      console.log("\n--------------------------------");
      console.log("🚨 SIMULATED SMS ALERT");
      console.log(`To: ${contact.name}`);
      console.log(`Phone: ${contact.phone}`);
      console.log(`Message: Emergency SOS activated.`);
      console.log(`Patient location: ${mapUrl}`);
      console.log("--------------------------------\n");
    });

    res.status(201).json({
      success: true,
      message: "SOS alert sent successfully",
      alert,
      emergencyContacts: contacts,
      mapUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("patientId", "name age phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const alerts = await Alert.find({
      patientId: req.params.patientId
    }).sort({ createdAt: -1 });

    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["NEW", "SEEN", "RESOLVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    res.json({ success: true, alert });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;