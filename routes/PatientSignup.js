const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Patient = require("../models/patient");

const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("Name is required"),
    body("lastName").notEmpty().withMessage("Last Name is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password } = req.body;


      // Check if the email is already registered
      let existingUser = await Patient.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      // Create the new patient object
      const newPatient = new Patient({
        firstName,
        lastName,
        email,
        password,
      });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      newPatient.password = await bcrypt.hash(password, salt);

      // Save the new patient to the database
      await newPatient.save();

      // Return a success response
      res.status(200).json({ msg: "Patient created successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
