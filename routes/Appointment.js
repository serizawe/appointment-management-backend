const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

// Route to get available appointments for a doctor
router.get('/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;
  console.log(doctorId)
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const appointments = await Appointment.find({
    doctor: doctorId,
    start: { $gte: now, $lt: nextWeek },
  });
  const availableAppointments = [];
  let currentTime = now;
  while (currentTime < nextWeek) {
    let found = false;
    for (let i = 0; i < appointments.length; i++) {
      const appointmentStart = new Date(appointments[i].start);
      const appointmentEnd = new Date(appointments[i].end);
      if (currentTime >= appointmentStart && currentTime < appointmentEnd) {
        found = true;
        break;
      }
    }
    if (!found) {
      availableAppointments.push(currentTime);
    }
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
  }
  res.json(availableAppointments);
});

// Route to make a new appointment
router.post('/', async (req, res) => {
  const { doctorId, start, end, patientId } = req.body;
  console.log(doctorId,patientId)
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  const appointment = new Appointment({
    doctor: doctorId,
    start: new Date(start),
    end: new Date(end),
    patient: patientId
  });
  await appointment.save();
  res.json({ message: 'Appointment created' });
});

module.exports = router;
