/**
 * Firebase configuration
 * Environment-based configuration for Firebase initialization
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase Emulator settings for development
export const useFirebaseEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

export const firebaseEmulatorSettings = {
  authEmulatorHost: process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST || 'localhost:9099',
  firestoreEmulatorHost: process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || 'localhost:8080',
};
