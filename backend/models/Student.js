// models/Student.js
const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectDescription: String,
  finalGrade: String,
  units: Number,
  remarks: String,
  yearLevel: String,
  semester: String,
});

const StudentSchema = new mongoose.Schema({
  studentNumber: String,
  fullName: String,
  program: String,
  dateGraduated: String,
  gwa: Number, // store as Number for easy query
  honor: String,
  subjects: [SubjectSchema],
});

module.exports = mongoose.model("Student", StudentSchema);
