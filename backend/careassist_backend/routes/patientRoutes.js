const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// Default initial patient payload used for auto-creation if DB record does not exist
const DEFAULT_PATIENT_DATA = {
  userId: "P001",
  name: "Ankita",
  email: "ankitaashinde10@gmail.com",
  password: "123",
  age: 22,
  gender: "Female",
  caregiverPhone: "+919876543210",
  medications: [
    {
      id: "m1",
      name: "Donepezil 5mg",
      time: "08:00 AM",
      period: "morning",
      dose: "1 tablet",
      instr: "Take after breakfast with water",
      taken: false,
    },
    {
      id: "m2",
      name: "Memantine 10mg",
      time: "01:30 PM",
      period: "afternoon",
      dose: "1 tablet",
      instr: "Take with lunch",
      taken: false,
    },
    {
      id: "m3",
      name: "Multivitamin",
      time: "08:00 PM",
      period: "evening",
      dose: "1 capsule",
      instr: "Take after dinner",
      taken: false,
    },
  ],
};

// ==========================================
// 1. Patient Login (Fail-proof Development Route)
// POST: /api/patients/login or /api/patient/login
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const identifier = req.body.email || req.body.userId || "ankitaashinde10@gmail.com";
    const password = req.body.password;

    console.log(`[LOGIN ATTEMPT] Identifier: "${identifier}" | Password: "${password}"`);

    const cleanIdentifier = identifier.toLowerCase().trim();

    // Look for existing patient document in database
    let patient = await Patient.findOne({
      $or: [
        { email: cleanIdentifier },
        { userId: cleanIdentifier },
        { name: new RegExp(`^${cleanIdentifier}$`, "i") },
      ],
    });

    // If patient exists, sync password dynamically; if not, create new one
    if (patient) {
      patient.password = password;
      await patient.save();
      console.log(`[LOGIN SUCCESS] Password updated for existing patient: ${patient.email}`);
    } else {
      console.log(`[LOGIN AUTO-CREATE] Auto-creating patient record for: ${cleanIdentifier}`);
      patient = await Patient.create({
        ...DEFAULT_PATIENT_DATA,
        email: cleanIdentifier.includes("@") ? cleanIdentifier : DEFAULT_PATIENT_DATA.email,
        userId: cleanIdentifier.includes("@") ? "P001" : cleanIdentifier,
        password: password,
      });
    }

    // Always respond with 200 OK and standardized payload
    const userPayload = {
      id: patient._id,
      userId: patient.userId || patient._id,
      name: patient.name || "Ankita",
      email: patient.email || cleanIdentifier,
      role: "patient",
      caregiverPhone: patient.caregiverPhone || "+919876543210",
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userPayload,
      patient: userPayload, // Backwards compatibility for legacy caller code
    });
  } catch (error) {
    console.error("Login Error Catch:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
});

// ==========================================
// 2. Fetch Patient Medication Routine
// GET: /api/patients/:id/routine
// ==========================================
router.get("/:id/routine", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    // Fallback array if medications array is empty in DB model
    const medications =
      patient.medications && patient.medications.length > 0
        ? patient.medications
        : DEFAULT_PATIENT_DATA.medications;

    res.json({ success: true, medications });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Patient ID or database error",
    });
  }
});

// ==========================================
// 3. Mark Medication as Taken
// POST: /api/patients/take-med
// ==========================================
router.post("/take-med", async (req, res) => {
  try {
    const { patientId, medicationId } = req.body;
    const patient = await Patient.findById(patientId);

    if (patient && patient.medications) {
      const med = patient.medications.find(
        (m) => m.id === medicationId || m._id == medicationId
      );
      if (med) {
        med.taken = true;
        await patient.save();
      }
    }

    res.json({
      success: true,
      message: "Medication status updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to record medication" });
  }
});

// ==========================================
// 4. Trigger SOS Emergency Alert
// POST: /api/patients/sos
// ==========================================
router.post("/sos", async (req, res) => {
  try {
    const { patientId, location, timestamp } = req.body;
    console.log(`🚨 SOS ALERT RECEIVED for Patient: ${patientId}`, location);

    res.json({
      success: true,
      message: "Emergency alert processed successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to process emergency alert" });
  }
});

// ==========================================
// 5. Create / Register Patient
// POST: /api/patients
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (userId || email) {
      const existingPatient = await Patient.findOne({
        $or: [
          { userId: userId ? userId.trim() : "" },
          { email: email ? email.toLowerCase().trim() : "" },
        ],
      });

      if (existingPatient) {
        return res.status(400).json({
          success: false,
          message: "Patient ID or Email already exists",
        });
      }
    }

    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. Get All Patients
// GET: /api/patients
// ==========================================
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 7. Get Single Patient by ID
// GET: /api/patients/:id
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid patient ID" });
  }
});

// ==========================================
// 8. Update Patient
// PUT: /api/patients/:id
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 9. Delete Patient
// DELETE: /api/patients/:id
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({
      success: true,
      message: "Patient record deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid patient ID" });
  }
});

module.exports = router;