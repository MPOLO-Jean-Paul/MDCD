'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@/dataconnect-generated';

export async function initializeFirebase() {
  let firebaseApp: FirebaseApp;
  
  if (!getApps().length) {
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }

  const auth = getAuth(firebaseApp);

  // Modern offline-first persistence setup (replaces deprecated enableIndexedDbPersistence)
  // Uses multi-tab cache so all browser tabs share the same offline cache
  let firestore;
  try {
    firestore = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    console.log("Firestore offline persistence (multi-tab) enabled.");
  } catch (e: any) {
    // initializeFirestore throws if already initialized - fall back to getFirestore
    firestore = getFirestore(firebaseApp);
    if (e.code !== 'failed-precondition') {
      console.warn('Firestore persistence setup warning:', e);
    }
  }

  const dataConnect = getDataConnect(firebaseApp, connectorConfig);

  return {
    firebaseApp,
    auth,
    firestore,
    dataConnect,
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
