const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  userType:{
    type:String,
    required:false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
  // add other fields as necessary
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
