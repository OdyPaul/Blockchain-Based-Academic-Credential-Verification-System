// backend/models/Curriculum.js
const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectDescription: String,
  units: Number,
  yearLevel: String,   // optional if subjects were flattened
  semester: String,
});

const CurriculumSchema = new mongoose.Schema({
  program: { type: String, required: true },
  curriculumYear: String,
  // store the hierarchical structure (object with year -> semester -> [subjects])
  structure: { type: mongoose.Schema.Types.Mixed, default: {} },
  // optional flat subjects array (backwards compatibility)
  subjects: { type: [SubjectSchema], default: [] },
});

module.exports = mongoose.model("Curriculum", CurriculumSchema);
