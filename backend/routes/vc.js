const express = require('express');
const router = express.Router();
const { buildVCJsonFromStudent, canonicalize } = require('../lib/vcBuilder');
const { ethers } = require('ethers');
const Student = require('../models/Student');
const VCModel = require('../models/VerifiableCredential');
const ISSUER_ADDRESS = (process.env.METAMASK_ISSUER_ADDRESS || "").toLowerCase();

if (!ISSUER_ADDRESS) {
  console.warn("⚠️ METAMASK_ISSUER_ADDRESS is not set in .env");
}

// Endpoint A: return canonical payload to sign (admin frontend calls this)
router.get('/payload/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const issuer = { id: ISSUER_ADDRESS }; // or "did:example:uni"
    const vc = buildVCJsonFromStudent(student, issuer);
    const payload = canonicalize(vc);
    // Send canonical payload string to the client for signing
    res.json({ payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Endpoint B: receive signature from client, verify, save VC
router.post('/submit-signed-vc', async (req, res) => {
  try {
    const { studentId, signature } = req.body;
    if (!studentId || !signature) return res.status(400).json({ error: 'Missing studentId or signature' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const issuer = { id: ISSUER_ADDRESS };
    const vc = buildVCJsonFromStudent(student, issuer);
    const payload = canonicalize(vc);

    // Recover address from signature
    const recovered = ethers.utils.verifyMessage(payload, signature).toLowerCase();

    if (recovered !== ISSUER_ADDRESS) {
      return res.status(403).json({ error: 'Signature does not match issuer address' });
    }

    // Build proof and save VC
    const proof = {
      type: "EthereumPersonalSignature",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: ISSUER_ADDRESS,
      jws: signature // keep original hex signature
    };

    // remove proof from vc (vc currently no proof) and attach proof
    const signedVC = Object.assign({}, vc, { proof });

    // Save to DB
    await VCModel.deleteMany({ student: student._id, 'issuer.id': ISSUER_ADDRESS }); // optional: replace old VC
    const doc = new VCModel({
      student: student._id,
      issuer: { id: ISSUER_ADDRESS, name: "Your Institution" },
      context: signedVC["@context"],
      type: signedVC.type,
      credentialSubject: signedVC.credentialSubject,
      issuanceDate: signedVC.issuanceDate,
      proof: signedVC.proof
    });
    await doc.save();

    res.json({ ok: true, vcId: doc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
