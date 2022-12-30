const express = require("express");
const mysql = require("mysql2");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

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
connection.connect((error) => {
  if (error) throw error;
  console.log("Connected to the database");
});

// Set up a route to get employee data
app.get("/", (req, res) => {
  connection.query("SELECT * FROM employees", (error, results) => {
    if (error) throw error;

    // Render the employee data in a template
    res.render("employees", { employees: results });
  });
});

app.post("/", (req, res) => {
  const name = req.body.name;
  const department = req.body.department;

  connection.query(
    "INSERT INTO employees (name, department) VALUES (?, ?)",
    [name, department],
    (error, results) => {
      if (error) throw error;

      res.redirect("/");
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
