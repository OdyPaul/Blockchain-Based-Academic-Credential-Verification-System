// models/VerifiableCredential.js
const mongoose = require("mongoose");

const ProofSchema = new mongoose.Schema({
  type: { type: String, default: "EcdsaSecp256r1Signature2019" }, // you can change to ES256 identifier
  created: String,
  proofPurpose: String,
  verificationMethod: String, // DID or key id
  jws: String, // compact signature (base64url)
});

const VCSchema = new mongoose.Schema({
  // link to the student/TOR
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

  // Issuer metadata
  issuer: {
    id: String,        // e.g. "did:example:university" or "UniversityXYZ"
    name: String,
  },

  // W3C VC-like fields
  context: { type: [String], default: ["https://www.w3.org/2018/credentials/v1"] },
  type: { type: [String], default: ["VerifiableCredential", "TranscriptOfRecords"] },

  // credential subject: the actual TOR content (embedded)
  credentialSubject: { type: mongoose.Schema.Types.Mixed, required: true },

  issuanceDate: { type: String, required: true }, // ISO date string
  expirationDate: { type: String }, // optional

  proof: ProofSchema,
}, { timestamps: true });

module.exports = mongoose.model("VerifiableCredential", VCSchema);
