const { Op } = require("sequelize");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

// ✅ Get all doctors
const getalldoctors = async (req, res) => {
  try {
    let condition = { isDoctor: true };

    // Exclude logged-in user if provided
    if (res.locals.userId) {
      condition.userId = { [Op.ne]: res.locals.userId };
    }

    const docs = await Doctor.findAll({
      where: condition,
      include: [{ model: User, as: "user" }],
    });

    return res.status(200).json(docs);
  } catch (error) {
    console.error("❌ Error in getalldoctors:", error);
    return res.status(500).json({ message: "Unable to get doctors" });
  }
};

// ✅ Get users who applied but not doctors yet
const getnotdoctors = async (req, res) => {
  try {
    const condition = {
      isDoctor: false,
    };

    if (res.locals.userId) {
      condition.userId = { [Op.ne]: res.locals.userId };
    }

    const docs = await Doctor.findAll({
      where: condition,
      include: [{ model: User, as: "user" }],
    });

    return res.status(200).json(docs);
  } catch (error) {
    console.error("❌ Error in getnotdoctors:", error);
    return res.status(500).json({ message: "Unable to get non-doctors" });
  }
};

// ✅ Apply for doctor
const applyfordoctor = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const alreadyFound = await Doctor.findOne({ where: { userId } });
    if (alreadyFound) {
      return res.status(400).json({ message: "Application already exists" });
    }

    await Doctor.create({ ...req.body.formDetails, userId });

    return res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("❌ Error in applyfordoctor:", error);
    return res.status(500).json({ message: "Unable to submit application" });
  }
};

// ✅ Accept doctor application
const acceptdoctor = async (req, res) => {
  try {
    const { id } = req.body; // userId of applicant

    await User.update(
      { isDoctor: true, status: "accepted" },
      { where: { id } }
    );

    await Doctor.update(
      { isDoctor: true },
      { where: { userId: id } }
    );

    await Notification.create({
      userId: id,
      content: "🎉 Congratulations, Your application has been accepted.",
    });

    return res.status(200).json({ message: "Application accepted" });
  } catch (error) {
    console.error("❌ Error in acceptdoctor:", error);
    return res.status(500).json({ message: "Error while accepting application" });
  }
};

// ✅ Reject doctor application
const rejectdoctor = async (req, res) => {
  try {
    const { id } = req.body; // userId of applicant

    await User.update(
      { isDoctor: false, status: "rejected" },
      { where: { id } }
    );

    await Doctor.destroy({ where: { userId: id } });

    await Notification.create({
      userId: id,
      content: "❌ Sorry, Your application has been rejected.",
    });

    return res.status(200).json({ message: "Application rejected" });
  } catch (error) {
    console.error("❌ Error in rejectdoctor:", error);
    return res.status(500).json({ message: "Error while rejecting application" });
  }
};

// ✅ Delete doctor
const deletedoctor = async (req, res) => {
  try {
    const { userId } = req.body;

    await User.update(
      { isDoctor: false },
      { where: { id: userId } }
    );

    await Doctor.destroy({ where: { userId } });
    await Appointment.destroy({ where: { userId } });

    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deletedoctor:", error);
    return res.status(500).json({ message: "Unable to delete doctor" });
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
  deletedoctor,
};
