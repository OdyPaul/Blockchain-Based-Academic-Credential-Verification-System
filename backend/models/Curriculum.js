// Curriculum.js
const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectDescription: String,
  units: Number,
  yearLevel: String,
  semester: String,
});

const CurriculumSchema = new mongoose.Schema({
  program: String,          // e.g. "BSIT", "BSCS"
  curriculumYear: String,   // e.g. "2024"
  subjects: [SubjectSchema]
});

module.exports = mongoose.model("Curriculum", CurriculumSchema);
