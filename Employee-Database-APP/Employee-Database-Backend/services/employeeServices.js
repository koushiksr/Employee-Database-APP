const employeedetails = require("../models/EmployeeSchema");
class EmployeeServices {
  constructor() { }

  createOne = async (body) => {
    return await employeedetails.create(body);
  };

  getAll = async (skip, pageSize, res) => {
    return await employeedetails.find().sort({ createdDate: -1 }).skip(skip).limit(pageSize)
  };

  getAllWithoutPAgination = async () => {
    return await employeedetails.find();
  };

  getOne = async (email) => {
    return await employeedetails.findOne({ email: email });
  };

  updateOne = async (Email, body) => {
    return await employeedetails.findOneAndUpdate({ email: Email }, { $set: body });
  };

  findByIdAndRemove = async (Gmail) => {
    return await employeedetails.findOneAndDelete({ email: Gmail });
  };
}

module.exports = EmployeeServices;
