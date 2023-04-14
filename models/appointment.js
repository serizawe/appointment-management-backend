const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
