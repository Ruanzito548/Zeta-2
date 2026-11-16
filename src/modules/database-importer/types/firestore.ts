/**
 * Firestore type definitions
 * Type-safe wrapper for Firestore operations
 */

/**
 * Firestore batch operations wrapper
 */
export interface FirestoreBatch {
  set(ref: FirestoreDocRef, data: Record<string, unknown>): void;
  update(ref: FirestoreDocRef, data: Record<string, unknown>): void;
  delete(ref: FirestoreDocRef): void;
  commit(): Promise<void>;
  _writes?: unknown[]; // Internal Firebase property for checking batch size
}

/**
 * Firestore document reference wrapper
 */
export interface FirestoreDocRef {
  set(data: Record<string, unknown>): Promise<void>;
  update(data: Record<string, unknown>): Promise<void>;
  get(): Promise<FirestoreDocSnapshot>;
}

/**
 * Firestore document snapshot wrapper
 */
export interface FirestoreDocSnapshot {
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}

/**
 * Firestore collection reference wrapper
 */
export interface FirestoreCollectionRef {
  doc(id: string): FirestoreDocRef;
}

/**
 * Firestore database wrapper
 */
export interface FirestoreDB {
  collection(path: string): FirestoreCollectionRef;
  batch(): FirestoreBatch;
}
