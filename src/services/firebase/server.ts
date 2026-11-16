/**
 * Firebase Admin SDK Initialization
 * Initialize Firebase Admin SDK for server-side operations
 */

import { initializeApp, type ServiceAccount, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth, type Auth as AdminAuth } from 'firebase-admin/auth';
import {
  getFirestore as getAdminFirestore,
  type Firestore as AdminFirestore,
} from 'firebase-admin/firestore';

let adminApp: ReturnType<typeof initializeApp> | null = null;
let adminAuth: AdminAuth | null = null;
let adminFirestore: AdminFirestore | null = null;

function initializeFirebaseAdmin() {
  if (adminApp) {
    return { app: adminApp, auth: adminAuth, firestore: adminFirestore };
  }

  if (!process.env.FIREBASE_ADMIN_SDK_KEY) {
    throw new Error('FIREBASE_ADMIN_SDK_KEY environment variable is not set');
  }

  let serviceAccount: ServiceAccount;

  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY) as ServiceAccount;
  } catch {
    throw new Error(
      'Invalid JSON in FIREBASE_ADMIN_SDK_KEY environment variable. ' +
      'Make sure it contains a valid Firebase service account JSON.',
    );
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  adminAuth = getAdminAuth(adminApp);
  adminFirestore = getAdminFirestore(adminApp);

  return { app: adminApp, auth: adminAuth, firestore: adminFirestore };
}

export function getAdminAuthInstance(): AdminAuth {
  if (!adminAuth) {
    const { auth } = initializeFirebaseAdmin();
    adminAuth = auth;
  }
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }
  return adminAuth;
}

export function getAdminFirestoreInstance(): AdminFirestore {
  if (!adminFirestore) {
    const { firestore } = initializeFirebaseAdmin();
    adminFirestore = firestore;
  }
  if (!adminFirestore) {
    throw new Error('Firebase Admin Firestore is not initialized');
  }
  return adminFirestore;
}

export default initializeFirebaseAdmin;
