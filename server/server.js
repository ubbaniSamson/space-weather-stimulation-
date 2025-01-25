const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/media', express.static(path.join(__dirname, '../media')));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "space_weather_simulation",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});
// Admin Registration API
app.post("/api/adminRegister", (req, res) => {
    const { firstName, lastName, username, email, password, secretKey } = req.body;

    // Validate the secret key
    if (secretKey !== "your-secret-key") {
        return res.status(403).json({ message: "Unauthorized action." });
    }

    if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sql = "INSERT INTO admins (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, username, email, password], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error registering admin." });
        }
        res.status(200).json({ message: "Admin registered successfully." });
    });
});


// Admin Login API
app.post("/api/adminLogin", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error during login." });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        res.status(200).json({ message: "Login successful." });
    });
});


// API to get admin's first name
app.post("/api/adminLogin", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT id, first_name FROM admins WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error during login." });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Respond with the admin's first name
        res.status(200).json({
            message: "Login successful.",
            firstName: results[0].first_name,
        });
    });
});


// Student Login API
app.post("/api/studentLogin", (req, res) => {
    const { studentName, studentID } = req.body;
    const sql = "SELECT * FROM students WHERE name = ? AND studentID = ?";
    db.query(sql, [studentName, studentID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error during login" });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid name or student ID" });
        }

        // Update login count
        const updateSql = "UPDATE students SET login_count = login_count + 1 WHERE studentID = ?";
        db.query(updateSql, [studentID], (updateErr) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({ message: "Error updating login count" });
            }
            res.status(200).json({ message: "Login successful" });
        });
    });
});

// Get All Student IDs
app.get("/api/getStudentIDs", (req, res) => {
    const sql = "SELECT id, name, studentID FROM students";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error retrieving student IDs." });
        }
        res.status(200).json(results);
    });
});

// Add Student ID
app.post("/api/addStudentID", (req, res) => {
    const { studentID, name } = req.body;

    if (!studentID || !name) {
        return res.status(400).json({ message: "Student ID and Name are required." });
    }

    const sql = "INSERT INTO students (studentID, name) VALUES (?, ?)";
    db.query(sql, [studentID, name], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error adding student ID." });
        }
        res.status(200).json({ message: "Student ID added successfully." });
    });
});

// Delete Student ID
app.delete("/api/deleteStudentID/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM students WHERE id = ?";
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error deleting student ID." });
        }
        res.status(200).json({ message: "Student ID deleted successfully." });
    });
});

// Get Student Progress
app.get("/api/getStudentIDs", (req, res) => {
    const sql = "SELECT id, name, studentID FROM students";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error retrieving student IDs." });
        }
        res.status(200).json(results);
    });
});

// Manage Quiz Questions
app.get("/api/getQuizQuestions", (req, res) => {
    const sql = "SELECT * FROM quiz_questions";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error retrieving quiz questions" });
        }
        res.status(200).json(results);
    });
});

// Add Quiz Question
app.post("/api/addQuizQuestion", (req, res) => {
    const { question, options, answer } = req.body;
    const sql = "INSERT INTO quiz_questions (question, options, answer) VALUES (?, ?, ?)";
    db.query(sql, [question, JSON.stringify(options), answer], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error adding quiz question" });
        }
        res.status(200).json({ message: "Quiz question added successfully" });
    });
});

// Delete Quiz Question
app.delete("/api/deleteQuizQuestion/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM quiz_questions WHERE id = ?";
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error deleting quiz question" });
        }
        res.status(200).json({ message: "Quiz question deleted successfully" });
    });
});
// API to fetch dashboard overview
app.get("/api/dashboardOverview", (req, res) => {
    const totalStudentsQuery = "SELECT COUNT(*) AS totalStudents FROM students";
    const totalQuizQuestionsQuery = "SELECT COUNT(*) AS totalQuizQuestions FROM quiz_questions";
    const recentLoginsQuery = "SELECT COUNT(*) AS recentLogins FROM students WHERE login_count > 0";

    db.query(totalStudentsQuery, (err, studentsResult) => {
        if (err) {
            console.error("Error fetching total students:", err);
            return res.status(500).json({ error: "Error fetching total students." });
        }
        db.query(totalQuizQuestionsQuery, (err, quizResult) => {
            if (err) {
                console.error("Error fetching quiz questions:", err);
                return res.status(500).json({ error: "Error fetching quiz questions." });
            }
            db.query(recentLoginsQuery, (err, loginsResult) => {
                if (err) {
                    console.error("Error fetching recent logins:", err);
                    return res.status(500).json({ error: "Error fetching recent logins." });
                }

                // Combine the results into one object
                res.json({
                    totalStudents: studentsResult[0].totalStudents,
                    totalQuizQuestions: quizResult[0].totalQuizQuestions,
                    recentLogins: loginsResult[0].recentLogins,
                });
            });
        });
    });
});

// API to get Dashboard Summary
app.get("/api/summary", (req, res) => {
    const summary = {
        totalStudents: 0,
        totalQuizQuestions: 0,
        recentLogins: 0
    };

    // Fetch Total Students
    db.query("SELECT COUNT(*) AS total FROM students", (err, studentsResult) => {
        if (!err) summary.totalStudents = studentsResult[0].total;

        // Fetch Total Quiz Questions
        db.query("SELECT COUNT(*) AS total FROM quiz_questions", (err2, quizResult) => {
            if (!err2) summary.totalQuizQuestions = quizResult[0].total;

            // Fetch Recent Logins Count
            db.query("SELECT SUM(login_count) AS total FROM students", (err3, loginResult) => {
                if (!err3) summary.recentLogins = loginResult[0].total;

                // Send the response
                res.json(summary);
            });
        });
    });
});


// Start the Server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
