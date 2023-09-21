const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");

const employeeDetailsSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  department: { type: String, required: true, trim: true },
  experience: { type: Number, required: true, trim: true },
  joiningDate: { type: String, required: true, trim: true },
  salary: { type: Number, required: true, trim: true },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

employeeDetailsSchema.pre("save", function (next) {
  if (!this.employeeId) {
    const uuid = uuidv4();
    const shortUuid = uuid.replace(/-/g, "").substring(0, 4);
    this.employeeId = `EMP-${shortUuid}`;
  }
  next();
});

const employeedetails = mongoose.model(
  "EmployeeDetails",
  employeeDetailsSchema
);
module.exports = employeedetails;
