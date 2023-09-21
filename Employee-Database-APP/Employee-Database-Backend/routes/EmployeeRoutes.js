const express = require("express");
const employeeController = require("../controller/employeeController");

const router = express.Router();

const EmployeeController = new employeeController();

router.post("/create", EmployeeController.newEmployee);
router.get("/getall", EmployeeController.allEmployees);
router.get("/getallWithoutpPagination", EmployeeController.allEmployeesWithoutPagination);
router.get("/getone/:email", EmployeeController.oneEmployee);
router.put("/update/:email", EmployeeController.updateEmployee);
router.delete("/delete/:email", EmployeeController.deleteEmployee);

module.exports = router;
