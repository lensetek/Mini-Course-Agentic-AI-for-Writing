import { readFile } from "node:fs/promises";
import process from "node:process";
import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config({ path: ".env" });
}

async function loadCredential() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const rawServiceAccount = await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8");
    return admin.credential.cert(JSON.parse(rawServiceAccount));
  }
  return admin.credential.applicationDefault();
}

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: await loadCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }

  const db = admin.firestore();
  
  // 1. Update academic_certificates
  const certsSnapshot = await db.collection("academic_certificates").get();
  const certsBatch = db.batch();
  let updatedCerts = 0;

  for (const doc of certsSnapshot.docs) {
    const data = doc.data();
    if (data.certificateNo && data.certificateNo.startsWith("LAIMB-")) {
      const newCertNo = data.certificateNo.replace("LAIMB-", "LAIMRA-");
      
      const newCertData = {
        ...data,
        certificateNo: newCertNo,
        courseTitle: "Agentic AI Mastery for Researchers & Authors",
        verificationUrl: data.verificationUrl ? data.verificationUrl.replace("LAIMB-", "LAIMRA-") : "",
      };

      // Create new doc
      certsBatch.set(db.collection("academic_certificates").doc(newCertNo), newCertData);
      
      // Update old doc to be superseded (or delete it, but supersede is safer as per App.jsx logic)
      certsBatch.set(doc.ref, {
        certificateNo: data.certificateNo,
        status: "reissued",
        reissuedTo: newCertNo,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      updatedCerts++;
    } else if (data.courseTitle === "Agentic AI for Marketing & Business" || data.courseTitle !== "Agentic AI Mastery for Researchers & Authors") {
       // Just update the title if the prefix is fine but title is old
       certsBatch.set(doc.ref, {
           courseTitle: "Agentic AI Mastery for Researchers & Authors"
       }, { merge: true });
       updatedCerts++;
    }
  }

  if (updatedCerts > 0) {
    await certsBatch.commit();
    console.log(`Updated ${updatedCerts} certificates in academic_certificates.`);
  } else {
    console.log("No certificates needed updating in academic_certificates.");
  }

  // 2. Update academic_progress
  const progressSnapshot = await db.collection("academic_progress").get();
  const progressBatch = db.batch();
  let updatedProgress = 0;

  for (const doc of progressSnapshot.docs) {
    const data = doc.data();
    let needsUpdate = false;
    let newCertData = null;

    if (data.certificate) {
      newCertData = { ...data.certificate };
      if (newCertData.certificateNo && newCertData.certificateNo.startsWith("LAIMB-")) {
        newCertData.certificateNo = newCertData.certificateNo.replace("LAIMB-", "LAIMRA-");
        if (newCertData.verificationUrl) {
           newCertData.verificationUrl = newCertData.verificationUrl.replace("LAIMB-", "LAIMRA-");
        }
        needsUpdate = true;
      }
      if (newCertData.courseTitle !== "Agentic AI Mastery for Researchers & Authors") {
        newCertData.courseTitle = "Agentic AI Mastery for Researchers & Authors";
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      progressBatch.update(doc.ref, { certificate: newCertData });
      updatedProgress++;
    }
  }

  if (updatedProgress > 0) {
    await progressBatch.commit();
    console.log(`Updated ${updatedProgress} user progress records in academic_progress.`);
  } else {
    console.log("No user progress records needed updating.");
  }
}

main().catch((error) => {
  console.error("Failed to patch certificates:", error);
  process.exit(1);
});
