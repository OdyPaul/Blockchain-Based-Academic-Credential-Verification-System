// scripts/createVCFromStudent.js
const mongoose = require("mongoose");
const Student = require("../models/Student");
const VC = require("../models/VerifiableCredential");

/**
 * Build a VC-compatible JSON object from a Student document.
 * Keep credentialSubject small and relevant (avoid saving huge redundant data).
 */
function buildVCJsonFromStudent(studentDoc, issuer) {
  const issuanceDate = new Date().toISOString();

  // Minimal subject payload — include transcript details
  const transcript = {
    id: `urn:student:${studentDoc.studentNumber}`,
    studentNumber: studentDoc.studentNumber,
    fullName: studentDoc.fullName,
    program: studentDoc.program,
    dateGraduated: studentDoc.dateGraduated,
    gwa: studentDoc.gwa,
    subjects: studentDoc.subjects.map(s => ({
      code: s.subjectCode,
      title: s.subjectDescription,
      units: s.units,
      yearLevel: s.yearLevel,
      semester: s.semester,
      finalGrade: s.finalGrade,
      remarks: s.remarks
    })),
  };

  const vc = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential", "TranscriptOfRecords"],
    issuer: issuer.id || issuer,      // e.g. "did:example:university"
    issuanceDate,
    credentialSubject: transcript,
  };

  return vc;
}
