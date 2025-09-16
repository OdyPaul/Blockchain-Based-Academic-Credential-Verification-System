// scripts/signVc.js
const crypto = require("crypto");
const stringify = require("json-stable-stringify");
const base64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function signVc(vcObject, privateKeyPem, verificationMethodId) {
  // 1) canonicalize (stable stringify)
  const payload = stringify(vcObject);

  // 2) create signature (ECDSA P-256 + SHA256)
  const sign = crypto.createSign("SHA256");
  sign.update(payload);
  sign.end();
  const signature = sign.sign({ key: privateKeyPem, format: "pem", type: "pkcs8" }); // pkcs8 recommended

  // Convert DER signature to compact r|s (optional) — but base64url DER is acceptable.
  const jws = base64url(signature);

  // create proof object
  const proof = {
    type: "EcdsaSecp256r1Signature2019",
    created: new Date().toISOString(),
    proofPurpose: "assertionMethod",
    verificationMethod: verificationMethodId, // e.g. "did:example:uni#keys-1"
    jws,
  };

  // attach proof to VC (shallow copy original)
  const signedVC = Object.assign({}, vcObject, { proof });
  return signedVC;
}

function verifyVc(signedVcObject, publicKeyPem) {
  const proof = signedVcObject.proof;
  if (!proof || !proof.jws) return false;

  // extract jws (base64url) and convert back to Buffer
  const sigBuf = Buffer.from(proof.jws.replace(/-/g, "+").replace(/_/g, "/") + "===", "base64"); // pad
  // Recreate payload by removing proof before canonicalizing
  const vcCopy = Object.assign({}, signedVcObject);
  delete vcCopy.proof;
  const payload = stringify(vcCopy);

  const verify = crypto.createVerify("SHA256");
  verify.update(payload);
  verify.end();
  const ok = verify.verify(publicKeyPem, sigBuf);
  return ok;
}

module.exports = { signVc, verifyVc };
