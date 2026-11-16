'use client';

import React, { useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { getFirebaseApp } from '@/services/firebase/client';
import { getFirebaseAuth } from '@/services/firebase/client';
import { getFirebaseFirestore } from '@/services/firebase/client';

interface FirebaseStatus {
  appInitialized: boolean;
  authReady: boolean;
  firestoreReady: boolean;
  userAuthenticated: boolean;
  userId: string | null;
  error: string | null;
  timestamp: string;
}

export default function FirebaseTestComponent() {
  const [status, setStatus] = useState<FirebaseStatus>({
    appInitialized: false,
    authReady: false,
    firestoreReady: false,
    userAuthenticated: false,
    userId: null,
    error: null,
    timestamp: '',
  });

  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // 1. Test Firebase App Initialization
        const app = getFirebaseApp();
        console.log('✅ Firebase App initialized');
        setStatus((prev) => ({
          ...prev,
          appInitialized: true,
          timestamp: new Date().toLocaleTimeString(),
        }));

        // 2. Test Auth
        const auth = getFirebaseAuth();
        console.log('✅ Auth instance obtained');
        setStatus((prev) => ({
          ...prev,
          authReady: true,
          timestamp: new Date().toLocaleTimeString(),
        }));

        // 3. Test Firestore
        const db = getFirebaseFirestore();
        console.log('✅ Firestore instance obtained');
        setStatus((prev) => ({
          ...prev,
          firestoreReady: true,
          timestamp: new Date().toLocaleTimeString(),
        }));

        // 4. Test Anonymous Authentication
        try {
          const userCred = await signInAnonymously(auth);
          console.log('✅ Anonymous user authenticated:', userCred.user.uid);
          setStatus((prev) => ({
            ...prev,
            userAuthenticated: true,
            userId: userCred.user.uid,
            timestamp: new Date().toLocaleTimeString(),
          }));

          // 5. Test Firestore Query
          try {
            const itemsCollection = collection(db, 'items');
            const snapshot = await getDocs(itemsCollection);
            console.log(`✅ Firestore query successful (${snapshot.size} documents)`);
          } catch (error: any) {
            // 404 or permission errors are normal in a fresh project
            if (error.code === 'permission-denied') {
              console.log('⚠️ Firestore: Permission denied (expected in fresh project)');
              console.log('   Set Firestore Security Rules to test reads');
            } else if (error.code === 'not-found') {
              console.log('⚠️ Firestore: Collection does not exist (expected)');
            } else {
              throw error;
            }
          }

          setFirebaseReady(true);
        } catch (authError: any) {
          if (authError.code === 'auth/operation-not-supported-in-this-environment') {
            console.log('⚠️ Anonymous auth not supported in this environment');
          } else {
            throw authError;
          }
        }
      } catch (error: any) {
        console.error('❌ Firebase test failed:', error);
        setStatus((prev) => ({
          ...prev,
          error: error.message || 'Unknown error',
          timestamp: new Date().toLocaleTimeString(),
        }));
      } finally {
        setLoading(false);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🔥 Firebase Integration Test</h1>
        <p className="text-gray-700">Real-time Firebase connection status</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatusCard
          title="Firebase App"
          status={status.appInitialized}
          loading={loading}
        />
        <StatusCard
          title="Authentication"
          status={status.authReady}
          loading={loading}
        />
        <StatusCard
          title="Firestore"
          status={status.firestoreReady}
          loading={loading}
        />
        <StatusCard
          title="User Authenticated"
          status={status.userAuthenticated}
          loading={loading}
        />
      </div>

      {/* User ID */}
      {status.userId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900">User ID (Anonymous):</p>
          <p className="text-xs font-mono text-blue-700 break-all mt-1">{status.userId}</p>
        </div>
      )}

      {/* Error */}
      {status.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-red-900">❌ Error:</p>
          <p className="text-sm text-red-700 mt-1">{status.error}</p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Status Summary</h2>
          <span className="text-xs text-gray-500">{status.timestamp}</span>
        </div>

        {firebaseReady ? (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 font-semibold">✅ Firebase is ready!</p>
            <p className="text-sm text-green-700 mt-1">
              All components initialized and connected successfully.
            </p>
          </div>
        ) : loading ? (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-900 font-semibold">🔄 Testing...</p>
            <p className="text-sm text-blue-700 mt-1">
              Initializing Firebase and testing connections.
            </p>
          </div>
        ) : status.error ? (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-900 font-semibold">❌ Firebase test failed</p>
            <p className="text-sm text-red-700 mt-1">
              Check the error message above and browser console (F12) for details.
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-yellow-900 font-semibold">⚠️ Partial functionality</p>
            <p className="text-sm text-yellow-700 mt-1">
              Some components initialized but not all features working.
            </p>
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
        <p className="font-semibold mb-2">💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Open browser console (F12) to see detailed Firebase logs</li>
          <li>Check Network tab to see Firebase API calls</li>
          <li>Permission errors are normal in a fresh Firebase project</li>
          <li>Add Firestore Security Rules to allow reads/writes</li>
          <li>Add domains to Authorized Domains in Firebase Console</li>
        </ul>
      </div>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  status: boolean;
  loading: boolean;
}

function StatusCard({ title, status, loading }: StatusCardProps) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">{title}</span>
          <div className="animate-spin">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-4 ${
        status
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-semibold ${status ? 'text-green-900' : 'text-red-900'}`}>
          {title}
        </span>
        <span className="text-xl">{status ? '✅' : '❌'}</span>
      </div>
    </div>
  );
}
