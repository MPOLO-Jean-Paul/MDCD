'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export async function initializeFirebase() { // Made async
  let firebaseApp: FirebaseApp;
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    // If already initialized, use the existing app
    firebaseApp = getApp();
  }

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  // Enable persistence. This must be done before any other Firestore operations.
  // It should only be attempted once per app load.
  try {
    await enableIndexedDbPersistence(firestore);
    console.log("Firebase persistence has been enabled.");
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      // This can happen if multiple tabs are open. Persistence can only be enabled in one tab at a time.
      console.warn("Firestore persistence failed to enable. This is likely due to another tab being open. Offline capabilities may be limited.");
    } else if (error.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn("Firestore persistence is not supported in this browser. Offline capabilities will be disabled.");
    }
  }

  return {
    firebaseApp,
    auth,
    firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth-provider';
