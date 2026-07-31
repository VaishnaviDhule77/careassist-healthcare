const cron = require("node-cron");

const Medication = require("../models/Medication");
const Alert = require("../models/Alert");

function startReminderService() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      // YYYY-MM-DD prevents duplicate reminders during the same day.
      const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");

      const medications = await Medication.find({
        reminderTime: currentTime,
        frequency: "Daily",
        $or: [
          { lastReminderDate: { $ne: today } },
          { lastReminderDate: { $exists: false } }
        ]
      });

      for (const medicine of medications) {
        console.log(
          `💊 REMINDER: ${medicine.medicineName} (${medicine.dosage})`
        );

        await Alert.create({
          patientId: medicine.patientId,
          type: "MEDICATION",
          message: `Time to take ${medicine.medicineName} - ${medicine.dosage}`
        });

        medicine.lastReminderDate = today;
        await medicine.save();
      }
    } catch (error) {
      console.error("Reminder Engine Error:", error.message);
    }
  });

  console.log("⏰ Medication Reminder Engine Started");
}

module.exports = startReminderService;