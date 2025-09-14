const mongoose = require("mongoose");
const { Student, subjects } = require("./importCurriculum");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/capstone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Fetch all students
    const students = await Student.find();

    console.log("📌 Students with Curriculum:");
    students.forEach((s) => {
      console.log("\n===============================");
      console.log(`🎓 ${s.fullName} (${s.studentNumber})`);
      console.log(`Program: ${s.program}`);
      console.log(`GWA: ${s.gwa}, Honor: ${s.honor}`);
      console.log("Curriculum Subjects:");

      subjects.forEach((subj) => {
        console.log(
          `  - [${subj.yearLevel} | ${subj.semester}] ${subj.subjectCode} | ${subj.subjectDescription}| ${subj.finalGrade} (${subj.units} units)`
        );
      });
    });
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
