// generateStudent.js
const mongoose = require("mongoose");
const Student = require("../models/Student");
const Curriculum = require("../models/Curriculum");

mongoose.connect("mongodb://localhost:27017/capstone");

function getRandomGrade() {
  const grades = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 5.0];
  return grades[Math.floor(Math.random() * grades.length)];
}

function getRandomName() {
  const firstNames = ["Juan", "Maria", "Jose", "Ana", "Pedro", "Liza", "Mark", "Karla", "Paulo", "Ella"];
  const lastNames = ["Santos", "Reyes", "Cruz", "Gonzales", "Torres", "Flores", "Ramos", "Bautista", "Mendoza", "Garcia"];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`;
}

async function createRandomStudent(curriculum, studentNumber) {
  const subjectsWithGrades = curriculum.subjects.map((sub) => {
    const grade = getRandomGrade();
    return {
      ...sub.toObject(),
      finalGrade: grade,
      remarks: grade <= 3.0 ? "PASSED" : "FAILED",
    };
  });

  const validSubjects = subjectsWithGrades.filter((s) => s.finalGrade);
  const gwa = (
    validSubjects.reduce((sum, s) => sum + s.finalGrade, 0) / validSubjects.length
  ).toFixed(2);

  const student = new Student({
    studentNumber,
    fullName: getRandomName(),
    program: curriculum.program,
    dateGraduated: "2025-06-30",
    gwa,
    honor: "",
    curriculum: curriculum._id,
    subjects: subjectsWithGrades,
  });

  await student.save();
  console.log(`✅ ${student.fullName} (${curriculum.program}) created with GWA: ${gwa}`);
}

async function run() {
  try {
    const curriculums = await Curriculum.find({});
    if (curriculums.length === 0) {
      console.error("❌ No curriculums found. Run importAllCurriculums.js first.");
      return;
    }

    for (const curriculum of curriculums) {
      console.log(`\n📌 Generating students for ${curriculum.program}...`);
      for (let i = 1; i <= 10; i++) {
        await createRandomStudent(curriculum, `${curriculum.program}-2020-${1000 + i}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
