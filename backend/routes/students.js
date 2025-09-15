const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ✅ Route for passing students
router.get("/passing", async (req, res) => {
  try {
    const { search } = req.query;
    let filter = { gwa: { $lte: 3.0 } };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { studentNumber: { $regex: search, $options: "i" } },
        { program: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route for TOR by student ID
// routes/students.js
router.get("/:id/tor", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student.subjects || []);  // ✅ return subjects as TOR
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TOR" });
  }
});


// ✅ Route for searching all students (not just passing)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};

    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { studentNumber: { $regex: q, $options: "i" } },
        { program: { $regex: q, $options: "i" } },
      ];
    }

    const students = await Student.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route for getting a single student (used as VC JSON)
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student); // return full student object
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

module.exports = router;
