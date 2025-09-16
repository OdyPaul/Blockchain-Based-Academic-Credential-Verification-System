const express = require("express");
const { ethers } = require("ethers");
const Student = require("../models/Student");
const VCModel = require("../models/VerifiableCredential");
const { buildVCJsonFromStudent, canonicalize } = require("../lib/vcBuilder");

const router = express.Router();

// Load issuer wallet from private key
const ISSUER_PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY;
if (!ISSUER_PRIVATE_KEY) {
  throw new Error("❌ ISSUER_PRIVATE_KEY not set in .env");
}
const wallet = new ethers.Wallet(ISSUER_PRIVATE_KEY);

// Bulk VC signing
router.post("/bulk-issue", async (req, res) => {
  try {
    const { studentIds } = req.body;
    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ error: "No student IDs provided" });
    }

    const results = [];

    for (const id of studentIds) {
      const student = await Student.findById(id);
      if (!student) continue;

      // Build VC JSON
      const vc = buildVCJsonFromStudent(student, { id: wallet.address });
      const payload = canonicalize(vc);

      // Sign payload with issuer private key
      const signature = await wallet.signMessage(payload);

      const proof = {
        type: "EcdsaSecp256k1Signature2019",
        created: new Date().toISOString(),
        proofPurpose: "assertionMethod",
        verificationMethod: wallet.address,
        jws: signature,
      };

      const signedVC = Object.assign({}, vc, { proof });

      // Save VC to MongoDB
      const doc = new VCModel({
        student: student._id,
        issuer: { id: wallet.address, name: "Your Institution" },
        context: signedVC["@context"],
        type: signedVC.type,
        credentialSubject: signedVC.credentialSubject,
        issuanceDate: signedVC.issuanceDate,
        proof: signedVC.proof,
      });
      await doc.save();

      results.push(doc);
    }

    res.json({ ok: true, count: results.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "VC bulk issue failed" });
  }
});

module.exports = router;
