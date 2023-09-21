const EmployeeServices = require("../services/employeeServices");
const EmployeeDetails = require("../models/EmployeeSchema");
const employeeServices = new EmployeeServices();

class EmployeeController {
  constructor() { }

  // Create a new employee
  async newEmployee(req, res) {
    let val = { email: "" }; //(true)

    try {
      val = await EmployeeDetails.findOne({ email: req.body.email });

      if (val) {
        // An employee with the same email exists(true)
        console.log(`${req.body.email} email already exists`);
        return res.status(200).json({ error: "email already exist" });
      }

      // Create a new employee if the email is unique(false)
      const newEmployee = await employeeServices.createOne(req.body);
      console.log(newEmployee);
      const savedEmployee = await newEmployee.save();
      res.status(201).json(savedEmployee);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errorMessages = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          errors: errorMessages,
        });
      }
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Failed to create employee." });
    }
  }

  // Retrieve all employees
  async allEmployees(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      const skip = (page - 1) * pageSize;

      const allEmployees = await employeeServices.getAll(skip, pageSize, res);
      res.status(200).json(allEmployees);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve all employees." });
    }
  }
  async allEmployeesWithoutPagination(req, res) {
    console.log("emp")
    try {
      const allEmployees = await employeeServices.getAllWithoutPAgination();
      console.log(allEmployees)
      res.status(200).json(allEmployees);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve all employees." });
    }
  }

  // Retrieve an employee by ID
  async oneEmployee(req, res) {
    try {
      const oneEmployee = await employeeServices.getOne(req.params.email);
      if (!oneEmployee) {
        return res.status(404).json({ error: "Employee not found." });
      }
      res.status(200).json(oneEmployee);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve employee." });
    }
  }

  // Update an employee by ID
  async updateEmployee(req, res) {
    try {
      console.log(req.params.email);
      console.log(req.body);

      // Use destructuring to extract fields from req.body
      const { firstName, lastName, email, position, department, salary, joiningDate, experience } =
        req.body;

      // Update the employee using your employeeServices.updateOne method
      const updatedEmployee = await employeeServices.updateOne(
        req.params.email,
        { firstName, lastName, email, position, department, salary, joiningDate, experience }
      );
      // Find the updated data in the database
      const newData = await EmployeeDetails.findOne({
        email: req.params.email,
      });
      console.log(`${updatedEmployee} \n  old data`);
      console.log(`${newData}   \n new data`);
      // Check if the employee was not found in the database
      if (!newData) {
        console.log("Employee not found.");
        return res.status(404).json({ error: "Employee not found." });
      }
      // Check if the data was actually updated
      if (updatedEmployee !== newData) {
        console.log("Employee data updated ");
        return res.status(200).json({
          oldData: updatedEmployee,
          newData: newData,
        });
      }
      console.log("Employee data not updated");
      return res.status(200).json({
        message: "Employee data was not updated.",
        oldData: updatedEmployee,
        newData: newData,
      });
    } catch (error) {
      console.error(error);
      console.log("Failed to update employee.");
      res.status(500).json({ error: "Failed to update employee." });
    }
  }

  // Delete an employee by ID
  async deleteEmployee(req, res) {
    try {
      const deletedEmployee = await employeeServices.findByIdAndRemove(
        req.params.email
      );
      console.log(deletedEmployee);
      if (!deletedEmployee) {
        return res.status(404).json({ error: "Employee not found." });
      }
      return res
        .status(200)
        .json({ message: "Employee deleted", deletedEmployee });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = EmployeeController;
