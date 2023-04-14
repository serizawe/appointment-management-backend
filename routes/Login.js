const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const crypto = require('crypto');

// Middleware function to check if user is a doctor
const requireDoctor = (req, res, next) => {
  if (req.userType === "doctor") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Middleware function to check if user is a patient
const requirePatient = (req, res, next) => {
  if (req.userType === "patient") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Login route
router.post("/auth/login", async (req, res) => {
  const { email, password, userType } = req.body;
  const secretKey = crypto.randomBytes(64).toString('hex');
  let user;
  if (userType === "doctor") {
    user = await Doctor.findOne({ email });
  } else if (userType === "patient") {
    user = await Patient.findOne({ email });
  }

  // Check if user exists and password is correct
  if (user && await bcrypt.compare(password, user.password)) {
    // Generate JWT token with user ID and userType as payload
    const token = jwt.sign({ userId: user._id, userType }, secretKey);

    // Return token to client
    res.json({ token, userId: user._id });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Logout route
router.post("/auth/logout", async (req, res) => {
  res.json({ message: "Logout successful" });
});

// Protected doctor route
router.get("/doctors", requireDoctor, async (req, res) => {
  // Get all doctors from database
  const doctors = await Doctor.find();

  res.json(doctors);
});

// Protected patient route
router.get("/patients", requirePatient, async (req, res) => {
  // Get all patients from database
  const patients = await Patient.find();

  res.json(patients);
});

module.exports = router;
