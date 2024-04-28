require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Use the callback provided by createPool to check for connection errors
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    process.exit(1); // Exit the application if there's an error connecting to the database
  } else {
    console.log("Connected to the MySQL database");
    console.log("Connection ID:", connection.threadId);
    connection.release();
    // Release the connection when done
  }
});

// signup
app.post("/signup", async (req, res) => {
  try {
    const { name, password, id, role, department } = req.body;

    const checkPrnSql = "SELECT id FROM Users WHERE id = ?";

    db.query(checkPrnSql, [id], (error, results) => {
      if (error) {
        console.error("Error checking PRN: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Error checking PRN" });
      } else {
        if (results.length > 0) {
          console.log("PRN already exists");
          return res
            .status(400)
            .json({ success: false, message: "User already exists" });
        } else {
          // PRN does not exist

          // Hash the password for security
          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
              console.error("Error hashing password: ", err);
              return res
                .status(500)
                .json({ success: false, message: "Error hashing password" });
            } else {
              // Insert user into the users table
              const userSql =
                "INSERT INTO Users (id, password, name, role, department) VALUES (?, ?, ?, ?, ?)";

              db.query(
                userSql,
                [id, hashedPassword, name, role, department],
                (userErr, userResult) => {
                  if (userErr) {
                    console.error("Error inserting user: ", userErr);
                    return res.status(500).json({
                      success: false,
                      message: "Error inserting user",
                    });
                  } else {
                    return res.status(200).json({
                      success: true,
                      message: "Registration successful",
                    });
                  }
                }
              );
            }
          });
        }
      }
    });
  } catch (error) {
    console.error("Error in signup: ", error);

    res.status(500).json({
      success: false,
      message: "Error in signup",
      error: error.message,
    });
  }
});

// ** Login **
// POST Request: '/login' route
app.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;

    const searchUserById = "SELECT * FROM Users WHERE id = ?";

    db.query(searchUserById, [id], async (error, results) => {
      if (error) {
        console.error("Error searching user by ID:", error);

        return res.status(500).json({
          success: false,
          message: "Error searching user by ID",
        });
      } else {
        if (results.length > 0) {
          // User found, results contains the user information
          console.log("User found: ", results[0]);

          const passwordMatch = await bcrypt.compare(
            password,
            results[0].password
          );

          if (passwordMatch) {
            // Passwords match, user authentication successful
            const token = await jwt.sign(
              {
                id: results[0].id,
                role: results[0].role,
                name: results[0].name,
                department: results[0].department,
              },
              process.env.JWT_SECRET, // JWT Secret
              { expiresIn: "2d" }
            );

            console.log("User authenticated successfully: ", results[0]);

            return res.status(200).json({
              success: true,
              message: "User authenticated successfully",
              user: results[0],
              token: token,
            });
          } else {
            console.log("Wrong password");

            return res.status(401).json({
              success: false,
              message: "Wrong password",
            });
          }
        } else {
          console.log("User not found");

          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error in login: ", error);

    return res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
});

// ** Get profile details **
// GET Request: '/profile/:userId' route
app.get("/profile/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT id, name, role, deptartment FROM Users WHERE id = ?";

  // Execute the query
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user profile: ", err);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    const userProfile = {
      id: results[0].id,
      name: results[0].name,
      role: results[0].role,
      dept_name: results[0].department,
    };

    // Send the user profile data as a JSON response
    res.json(userProfile);
  });
});

// Route to add a new question
// POST Request: '/questions' route
app.post("/questions", (req, res) => {
  const {
    department,
    question_text,
    image_url,
    math_expression,
    created_by_id,
    correct_option,
    option_1,
    option_2,
    option_3,
    option_4,
    subject,
  } = req.body; // Include subject from request body

  const query = `INSERT INTO Questions (department, question_text, image_url, math_expression, created_by_id, correct_option, option_1, option_2, option_3, option_4, subject) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Include subject in the query

  db.query(
    query,
    [
      department,
      question_text,
      image_url,
      math_expression,
      created_by_id,
      correct_option,
      option_1,
      option_2,
      option_3,
      option_4,
      subject,
    ],
    (err, result) => {
      if (err) {
        console.log("Error in adding question: ", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.status(201).json({ message: "Question added successfully" });
    }
  );
});

// GET Request: '/getquestions' route
app.get("/getquestions", (req, res) => {
  const { department, subject } = req.query;

  const query = `SELECT * FROM Questions WHERE department = ? AND subject = ?`;

  db.query(query, [department, subject], (err, result) => {
    if (err) {
      console.log("Error fetching questions: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(result);
  });
});

// POST Request: '/create-test' route
app.post("/create-test", (req, res) => {
  const { department, coursename, duration, created_by_id, questions } =
    req.body;

  // Insert into Test table
  const testInsertQuery =
    "INSERT INTO Test (department, course_name, duration, created_by_id) VALUES (?, ?, ?, ?)";

  db.query(
    testInsertQuery,
    [department, coursename, duration, created_by_id],
    (err, result) => {
      if (err) {
        console.log("Error inserting into Test table: ", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const testId = result.insertId;

      // Insert into Test_Question table
      const testQuestionInsertQuery =
        "INSERT INTO Test_Question (test_id, question_id, subject) VALUES (?, ?, ?)";

      questions.forEach((questionId) => {
        db.query(
          testQuestionInsertQuery,
          [testId, questionId, coursename],
          (err, result) => {
            if (err) {
              console.log("Error inserting into Test_Question table: ", err);
              return res.status(500).json({ message: "Internal server error" });
            }
          }
        );
      });

      return res
        .status(201)
        .json({ message: "Test created successfully", testId });
    }
  );
});

// GET Request: '/test/questions' route
app.get("/test/questions", (req, res) => {
  const { test_id } = req.query;

  // Retrieve questions for the specified test ID
  const query =
    "SELECT * FROM Questions WHERE question_id IN (SELECT question_id FROM Test_Question WHERE test_id = ?)";

  db.query(query, [test_id], (err, results) => {
    if (err) {
      console.log("Error fetching test questions: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  });
});

// Backend API for retrieving tests created by a specific user
// GET Request: '/faculty/tests' route
app.get("/faculty/tests", (req, res) => {
  const { created_by_id } = req.query;

  // Retrieve tests created by the specified user
  const query = "SELECT * FROM Test WHERE created_by_id = ?";

  db.query(query, [created_by_id], (err, results) => {
    if (err) {
      console.log("Error fetching tests: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  });
});

// GET Request: '/department/tests' route
app.get("/department/tests", (req, res) => {
  const { department } = req.query;

  // Retrieve tests created by the specified department
  const query = "SELECT * FROM Test WHERE department = ?";

  db.query(query, [department], (err, results) => {
    if (err) {
      console.log("Error fetching tests: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  });
});

// Backend API for retrieving test details by test ID
// GET Request: '/test/details' route
app.get("/test/details", (req, res) => {
  const { test_id } = req.query;

  // Retrieve test details by test ID
  const query = "SELECT * FROM Test WHERE test_id = ?";

  db.query(query, [test_id], (err, results) => {
    if (err) {
      console.log("Error fetching test details: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results[0]);
  });
});

// Backend API for retrieving test questions by test ID
// GET Request: '/test/questions' route
app.get("/test/questions", (req, res) => {
  const { test_id } = req.query;

  // Retrieve test questions by test ID
  const query =
    "SELECT q.* FROM Questions q JOIN Test_Question tq ON q.question_id = tq.question_id WHERE tq.test_id = ?";

  db.query(query, [test_id], (err, results) => {
    if (err) {
      console.log("Error fetching test questions: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  });
});

// GET Request: '/get-tests' route
app.get("/get-tests", (req, res) => {
  const { department } = req.query;

  const query =
    "SELECT test_id, course_name, duration FROM Test WHERE department = ?";

  db.query(query, [department], (err, result) => {
    if (err) {
      console.log("Error fetching tests: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(result);
  });
});

// GET Request: '/test/questions/student' route
app.get("/test/questions/student", (req, res) => {
  const { test_id, department } = req.query;

  // Retrieve test questions by test ID
  const query =
    "SELECT q.* FROM Questions q JOIN Test_Question tq ON q.question_id = tq.question_id WHERE tq.test_id = ? and q.department= ?";

  db.query(query, [test_id, department], (err, results) => {
    if (err) {
      console.log("Error fetching test questions: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  });
});

// GET Request: '/test/duration' route
app.get("/test/duration", (req, res) => {
  const { test_id, department } = req.query;

  // Retrieve test duration by test ID and department
  const query =
    "SELECT duration FROM Test WHERE test_id = ? AND department = ?";

  db.query(query, [test_id, department], (err, results) => {
    if (err) {
      console.log("Error fetching test duration: ", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Test not found" });
    }

    const duration = results[0].duration;

    return res.status(200).json({ duration });
  });
});

// POST Request: '/start-test' route
app.post("/start-test", (req, res) => {
  const { test_id, coursename, student_id } = req.body;

  // Insert a new record into test_records table
  const insertQuery =
    "INSERT INTO test_records (test_id, coursename, student_id, status) VALUES (?, ?, ?, ?)";
  const params = [test_id, coursename, student_id, "ongoing"];

  db.query(insertQuery, params, (error, results) => {
    if (error) {
      console.log("Error starting test: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    const recordId = results.insertId;

    return res
      .status(200)
      .json({ message: "Test started successfully ", recordId });
  });
});

// PUT Request: '/update-test-status/:recordId' route
app.put("/update-test-status/:recordId", (req, res) => {
  const { status, marks } = req.body;
  const { recordId } = req.params;

  // Update test status and marks in test_records table
  const updateQuery =
    "UPDATE test_records SET status = ?, marks = ? WHERE record_id = ?";
  const params = [status, marks, recordId];

  db.query(updateQuery, params, (error) => {
    if (error) {
      console.log("Error updating test status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res
      .status(200)
      .json({ message: "Test status updated successfully" });
  });
});

app.post("/logout", (req, res) => {
  // Perform any necessary cleanup or session invalidation
  // For simplicity, we'll just send a success response
  res.clearCookie("connect.sid"); // Clear the session cookie
  res.json({ message: "Logout successful" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
