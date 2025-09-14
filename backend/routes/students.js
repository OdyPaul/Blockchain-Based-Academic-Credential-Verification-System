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

module.exports = router;
