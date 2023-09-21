const mongoose = require("mongoose");

require("dotenv").config();

const dbconnect = async() => {
 await  mongoose
    .connect(process.env.DATABASE_URL  , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      console.error("Error connecting to the database", error);
    });
};


module.exports = dbconnect;
