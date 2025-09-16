// scripts/createAndSignVCFromStudent.js
const mongoose = require("mongoose");
const Student = require("../models/Student");
const VCModel = require("../models/VerifiableCredential");
const { signVc, verifyVc } = require("./signVc"); // adjust path
const fs = require("fs");

async function run(studentId) {
  await mongoose.connect("mongodb://127.0.0.1:27017/capstone");

  // load keys (keep private key safe)
  const privateKeyPem = fs.readFileSync("./keys/private.pem", "utf-8");
  const publicKeyPem = fs.readFileSync("./keys/public.pem", "utf-8");

  const issuer = {
    id: "did:example:university:psau", // or any identifier
    name: "PSAU University"
  };

  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  // Build VC JSON
  const vc = buildVCJsonFromStudent(student, issuer);

  // Sign
  const signedVC = signVc(vc, privateKeyPem, `${issuer.id}#keys-1`);

  // Optional: verify before saving
  const ok = verifyVc(signedVC, publicKeyPem);
  if (!ok) throw new Error("Signature verification failed after signing!");

  // Save to DB
  const vcDoc = new VCModel({
    student: student._id,
    issuer,
    context: signedVC["@context"] || ["https://www.w3.org/2018/credentials/v1"],
    type: signedVC.type || ["VerifiableCredential"],
    credentialSubject: signedVC.credentialSubject,
    issuanceDate: signedVC.issuanceDate,
    proof: signedVC.proof,
  });
  await vcDoc.save();
  console.log("Saved VC:", vcDoc._id);

  await mongoose.disconnect();
}

run("PUT_STUDENT_ID_HERE").catch(e => { console.error(e); mongoose.disconnect(); });
