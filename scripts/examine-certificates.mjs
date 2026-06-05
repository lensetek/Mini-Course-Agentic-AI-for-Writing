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

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: await loadCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }

  const db = admin.firestore();
  const certsSnapshot = await db.collection("academic_certificates").get();
  console.log(`Found ${certsSnapshot.size} certificates in academic_certificates.`);
  certsSnapshot.forEach((doc) => {
    console.log(`ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });

  const progressSnapshot = await db.collection("academic_progress").get();
  console.log(`Found ${progressSnapshot.size} progress records in academic_progress.`);
  progressSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.certificate) {
      console.log(`Progress ID (UID): ${doc.id} contains certificate:`);
      console.log(JSON.stringify(data.certificate, null, 2));
    }
  });
}

main().catch((error) => {
  console.error("Error examining certificates:", error);
  process.exit(1);
});
