// importAllCurriculums.js
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const Curriculum = require("../models/Curriculum");

mongoose.connect("mongodb://127.0.0.1:27017/capstone");

async function importCurriculumFromFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Remove header row
  const [header, ...rows] = data;

  // Map subjects
  const subjects = rows
    .filter((row) => row.length > 0)
    .map((row) => ({
      subjectCode: row[0],
      subjectDescription: row[1],
      units: Number(row[2]) || 0,
      yearLevel: row[3]?.toString(),
      semester: row[4]?.toString(),
    }));

  // Derive program name from filename
  const fileName = path.basename(filePath, path.extname(filePath));
  // Example: "IT_Curriculum" → Program = IT
  const program = fileName.split("_")[0].toUpperCase();

  const curriculum = new Curriculum({
    program,
    curriculumYear: "2024", // you can change this to dynamic if needed
    subjects,
  });

  await curriculum.save();
  console.log(`✅ Imported curriculum for ${program}`);
}

async function run() {
  try {
    const dir = path.join(__dirname, "..", "Curriculums");
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".xlsx") || f.endsWith(".xlsm"));

    if (files.length === 0) {
      console.log("❌ No Excel files found in Curriculums folder.");
      return;
    }

    for (const file of files) {
      const filePath = path.join(dir, file);
      await importCurriculumFromFile(filePath);
    }
  } catch (err) {
    console.error("❌ Error importing:", err);
  } finally {
    mongoose.connection.close();
  }
}

run();
