// Student.js
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentNumber: String,
  fullName: String,
  program: String,
  dateGraduated: String,
  gwa: Number,
  honor: String,
  curriculum: { type: mongoose.Schema.Types.ObjectId, ref: "Curriculum" },
  subjects: [
    {
      subjectCode: String,
      subjectDescription: String,
      units: Number,
      finalGrade: Number,
      remarks: String,
      yearLevel: String,
      semester: String,
    },
  ],
});

module.exports = mongoose.model("Student", StudentSchema);
