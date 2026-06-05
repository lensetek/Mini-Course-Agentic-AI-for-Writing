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
    const rawServiceAccount = await fs.promises.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8");
    return admin.credential.cert(JSON.parse(rawServiceAccount));
  }
  return admin.credential.applicationDefault();
}

const newTranscript = [
  {
    moduleId: 1,
    title: "AI Research Brain with NotebookLM",
    hours: "4 Hours",
    status: "Completed"
  },
  {
    moduleId: 2,
    title: "Building Academic Productivity Agents with Google Opal",
    hours: "4 Hours",
    status: "Completed"
  },
  {
    moduleId: 3,
    title: "Building Research & Writing Skills with Google Antigravity",
    hours: "4 Hours",
    status: "Completed"
  },
  {
    moduleId: 4,
    title: "Autonomous Research & Book Publication Systems",
    hours: "4 Hours",
    status: "Completed"
  },
  {
    moduleId: 5,
    title: "Final Capstone Project",
    hours: "4 Hours",
    status: "Completed"
  }
];

const newCourseTitle = "Agentic AI Mastery for Researchers & Authors";
const baseOrigin = "https://restor.lensetek.online";

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: await loadCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }

  const db = admin.firestore();

  // 1. Regenerate documents in academic_certificates
  console.log("Updating academic_certificates collection...");
  const certsSnapshot = await db.collection("academic_certificates").get();
  const certsBatch = db.batch();
  let updatedCertsCount = 0;

  certsSnapshot.forEach((doc) => {
    const data = doc.data();
    const certNo = doc.id;
    const verificationUrl = `${baseOrigin}/verify/${certNo}`;

    // Prepare update data
    const updateData = {
      courseTitle: newCourseTitle,
      verificationUrl,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    // Only update transcript if status is not reissued, otherwise reissue transcript also updated
    updateData.transcript = newTranscript;

    console.log(`Queueing update for certificate: ${certNo} (holder: ${data.holderName || 'Unknown'})`);
    certsBatch.set(doc.ref, updateData, { merge: true });
    updatedCertsCount++;
  });

  if (updatedCertsCount > 0) {
    await certsBatch.commit();
    console.log(`Successfully updated ${updatedCertsCount} certificates in academic_certificates.`);
  } else {
    console.log("No certificates found in academic_certificates.");
  }

  // 2. Regenerate certificate fields in academic_progress
  console.log("\nUpdating academic_progress collection...");
  const progressSnapshot = await db.collection("academic_progress").get();
  const progressBatch = db.batch();
  let updatedProgressCount = 0;

  progressSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.certificate) {
      const certNo = data.certificate.certificateNo;
      const verificationUrl = `${baseOrigin}/verify/${certNo}`;

      const updatedCertField = {
        ...data.certificate,
        courseTitle: newCourseTitle,
        transcript: newTranscript,
        verificationUrl
      };

      console.log(`Queueing update for user progress ID: ${doc.id} (cert: ${certNo})`);
      progressBatch.update(doc.ref, {
        certificate: updatedCertField,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      updatedProgressCount++;
    }
  });

  if (updatedProgressCount > 0) {
    await progressBatch.commit();
    console.log(`Successfully updated ${updatedProgressCount} progress records in academic_progress.`);
  } else {
    console.log("No progress records containing certificates were found.");
  }

  console.log("\nCertificate regeneration completed successfully.");
}

main().catch((error) => {
  console.error("Error regenerating certificates:", error);
  process.exit(1);
});
