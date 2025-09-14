// importCurriculum.js
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/capstone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas
const SubjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectDescription: String,
  finalGrade: String,
  units: Number,
  remarks: String,
  yearLevel: String,
  semester: String
});

const StudentSchema = new mongoose.Schema({
  studentNumber: String,
  fullName: String,
  program: String,
  dateGraduated: String,
  gwa: String,
  honor: String,
  subjects: [SubjectSchema],
});

const Student = mongoose.model("Student", StudentSchema);

// Load Excel
const workbook = xlsx.readFile(
  path.join(__dirname, "..", "Curriculums/IT_Curriculum.xlsx")
);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Parse rows
let yearLevel = "";
let semester = "";
let subjects = [];

data.forEach((row) => {
  if (row[0] && row[0].includes("YEAR")) {
    // Example: "1ST YEAR - 1ST SEMESTER"
    [yearLevel, semester] = row[0].split("-");
    yearLevel = yearLevel.trim();
    semester = semester.trim();
  } 
  // make sure this is a valid subject row
  else if (
    row[0] && row[1] &&
    row[0].trim().toUpperCase() !== "SUBJECT CODE" &&
    row[1].trim().toUpperCase() !== "SUBJECT DESCRIPTION" &&
    row[4] && !isNaN(row[4].toString().trim())
  ) {
    subjects.push({
      subjectCode: row[0].trim(),
      subjectDescription: row[1].trim(),
      finalGrade: row[3] || "N/A",
      units: Number(row[4]) || 0,      // force numeric
      remarks: "Pending",
      yearLevel,
      semester,
    });
  }
});

// Export models and parsed subjects
module.exports = { Student, SubjectSchema, StudentSchema, subjects };
