const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctor");

const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("specialty").notEmpty().withMessage("Specialty is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName,lastName, email, password,location, specialty } = req.body;

      // Check if the email is already registered
      let existingUser = await Doctor.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      // Create the new doctor object
      const newDoctor = new Doctor({
        firstName,
        lastName,
        email,
        password,
        location,
        specialty,
      });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      newDoctor.password = await bcrypt.hash(password, salt);

      // Save the new doctor to the database
      await newDoctor.save();

      // Return a success response
      res.status(200).json({ msg: "Doctor created successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
