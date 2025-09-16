const stringify = require('json-stable-stringify');

function buildVCJsonFromStudent(studentDoc, issuer) {
  const issuanceDate = new Date().toISOString();

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
    }))
  };

  const vc = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential", "TranscriptOfRecords"],
    issuer: issuer.id || issuer,      // e.g. issuer address or did
    issuanceDate,
    credentialSubject: transcript
  };

  return vc;
}

function canonicalize(vcObject) {
  // stable stringify returns deterministic string order
  return stringify(vcObject);
}

module.exports = { buildVCJsonFromStudent, canonicalize };
