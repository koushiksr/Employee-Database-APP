const express = require("express");
const cors = require('cors');
const EmployeeRoutes = require("./routes/EmployeeRoutes");
const dbconnect = require("./database/dbconnect");

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

app.get("/", (req, res) =>
  // res.setHeader("Access-Controll-Allow-Credentials",true);
  res.send({ msg: " welcome to home page of employee database" })
);
app.use("/employee", EmployeeRoutes);

// connecting database 
dbconnect();
//connecting port
app.listen(PORT, () =>
  console.log(`backend server running  on port   ${PORT}`)

  );
     