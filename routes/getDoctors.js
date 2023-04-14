const express = require("express");
const Doctor = require('../models/doctor');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query['firstName'] = { $regex: req.query.name, $options: 'i' };
    }

    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get(':id', getDoctor, (req, res) => {
  res.json(res.doctor);
});

async function getDoctor(req, res, next) {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor == null) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.doctor = doctor;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
