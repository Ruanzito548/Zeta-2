/**
 * Firebase Client Initialization
 * Initialize Firebase for client-side operations
 */

'use client';

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { firebaseConfig, useFirebaseEmulator, firebaseEmulatorSettings } from '@/config/firebase';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (!firebaseConfig.projectId) {
    throw new Error(
      'Firebase configuration is missing. Please set environment variables.',
    );
  }

  app = initializeApp(firebaseConfig);

  auth = getAuth(app);
  firestore = getFirestore(app);

  if (useFirebaseEmulator && typeof window !== 'undefined') {
    if (auth && firebaseEmulatorSettings.authEmulatorHost) {
      try {
        connectAuthEmulator(
          auth,
          `http://${firebaseEmulatorSettings.authEmulatorHost}`,
          { disableWarnings: true },
        );
      } catch {
        // Already connected or emulator not available
      }
    }

    if (firestore && firebaseEmulatorSettings.firestoreEmulatorHost) {
      try {
        const [host, port] = firebaseEmulatorSettings.firestoreEmulatorHost.split(
          ':',
        );
        connectFirestoreEmulator(firestore, host, parseInt(port, 10));
      } catch {
        // Already connected or emulator not available
      }
    }
  }

  return { app, auth, firestore };
}

const firebaseInstance = (() => {
  try {
    return initializeFirebase();
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
})();

export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return firestore;
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    throw new Error('Firebase App is not initialized');
  }
  return app;
}

export default firebaseInstance;
