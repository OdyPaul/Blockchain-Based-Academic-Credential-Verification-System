// backend/scripts/importAllCurriculums.js
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const Curriculum = require("../models/Curriculum");

async function importCurriculumFromFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let currentYear = "";
  let currentSem = "";
  const structure = {};

  data.forEach((row) => {
    if (!row || row.length === 0) return;
    const firstCell = row[0]?.toString().trim();
    if (!firstCell) return;

    // Skip obvious header labels
    const skipHeaders = [
      "SUBJECT CODE",
      "SUBJECT",
      "Course No.",
      "COURSE CODE",
      "DESCRIPTIVE TITLE",
      "DESCRIPTION",
      "UNITS",
    ];
    if (skipHeaders.includes(firstCell.toUpperCase())) return;

    // Detect markers like "1ST YEAR - 1ST SEMESTER" (robust split)
    if (/YEAR/i.test(firstCell) && /SEM/i.test(firstCell)) {
      const parts = firstCell.split(/\s*[-–—]\s*/); // split on hyphen/dash variants
      currentYear = parts[0].trim();
      currentSem = (parts[1] || "").trim();
      if (!structure[currentYear]) structure[currentYear] = {};
      if (!structure[currentYear][currentSem]) structure[currentYear][currentSem] = [];
      return;
    }

    // If row looks like a subject entry (subject code + description)
    // Try common column positions; adjust if your Excel layout differs
    const subjectCode = row[0]?.toString().trim();
    const subjectDescription = row[1]?.toString().trim();
    // some sheets may put units in column 2 or 3; try to find a numeric-looking cell
    let units = 0;
    for (let i = 2; i < Math.min(6, row.length); i++) {
      const val = row[i];
      if (val !== undefined && val !== null && !isNaN(Number(val))) {
        units = Number(val);
        break;
      }
    }

    // Only add if we have a subject code or description
    if (!subjectCode && !subjectDescription) return;

    const subject = {
      subjectCode: subjectCode || "",
      subjectDescription: subjectDescription || "",
      units,
    };

    if (currentYear && currentSem) {
      structure[currentYear][currentSem].push(subject);
    } else {
      // If no marker found yet, push under "UNSPECIFIED" bucket
      if (!structure.UNSPECIFIED) structure.UNSPECIFIED = {};
      if (!structure.UNSPECIFIED["UNSPECIFIED"]) structure.UNSPECIFIED["UNSPECIFIED"] = [];
      structure.UNSPECIFIED["UNSPECIFIED"].push(subject);
    }
  });

  // derive program from filename
  const fileName = path.basename(filePath, path.extname(filePath));
  const program = fileName.split("_")[0].toUpperCase();

  // Save as new Curriculum doc
  await Curriculum.create({
    program,
    curriculumYear: "2024",
    structure,
  });

  console.log(`✅ Imported curriculum for ${program}`);
}

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/capstone");
  try {
    const dir = path.join(__dirname, "..", "Curriculums");
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".xlsx") || f.endsWith(".xlsm") || f.endsWith(".xls"));

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
    await mongoose.disconnect();
  }
}

main();
