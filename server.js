const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const appointmentRouter = require("./routes/Appointment");
const doctorRouter = require("./routes/DoctorSignup");
const patientRouter = require("./routes/PatientSignup");
const getDoctor = require("./routes/getDoctors");
const login = require ("./routes/Login");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
  res.send("Server is up and running");
});


app.use("/signup",patientRouter); // add patient router
app.use("/signup/doctor", doctorRouter); // add doctor router
app.use("/api",login);
app.use("/appointments", appointmentRouter); // add appointments router
app.use("/doctors",getDoctor); // get doctor router


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
