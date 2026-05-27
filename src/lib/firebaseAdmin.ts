import admin from "firebase-admin";

let adminDb: admin.firestore.Firestore = null as any;

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      adminDb = admin.firestore();
    } catch (error) {
      console.error("Firebase admin initialization error", error);
    }
  } else {
    console.warn("Firebase Admin credentials missing. Skipping initialization (expected during build).");
  }
} else {
  try {
    adminDb = admin.firestore();
  } catch (error) {
    console.error("Failed to get Firestore instance:", error);
  }
}

export { adminDb };
