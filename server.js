const express = require("express");
const mysql = require("mysql2");

const app = express();

// Get the RDS connection details from environment variables
const host = "seif-rds.cdgxzsc1f3sx.us-east-1.rds.amazonaws.com";
const user = "seif";
const password = "seifbarouni123";
const database = "seifrds";

// Create a connection to the RDS database
const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
});

// Connect to the database
connection.connect(function (err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected to RDS database as id " + connection.threadId);
});

// Set up a route to retrieve data from the employees table
app.get("/employees", function (req, res) {
  connection.query(
    "SELECT * FROM employees",
    function (error, results, fields) {
      if (error) {
        console.error(error);
        res.send("Error retrieving employees");
        return;
      }
      res.send(results);
    }
  );
});

// Start the server
const port = 3000;
app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});

// Close the connection when the app is closed
process.on("SIGINT", () => {
  connection.end();
  process.exit();
});
