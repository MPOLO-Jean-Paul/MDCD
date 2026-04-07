'use client';

import React, { type ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// Define a type for the services object
interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  useEffect(() => {
    // Asynchronously initialize Firebase and enable persistence
    initializeFirebase()
      .then(services => {
        setFirebaseServices(services);
      })
      .catch(error => {
        console.error("Fatal error initializing Firebase:", error);
        setInitializationError(error);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  // While initializing, show a loading skeleton to prevent the app from rendering prematurely
  if (!firebaseServices) {
    if (initializationError) {
      return (
        <div className="flex h-screen w-full items-center justify-center p-4">
          <div className="text-center text-destructive">
            <h1 className="text-2xl font-bold">Erreur d'initialisation</h1>
            <p>Impossible de charger l'application. Veuillez réessayer plus tard.</p>
          </div>
        </div>
      )
    }
    return (
      <div className="flex h-screen w-full items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    );
  }

  // Once services are available, render the provider and the rest of the app
  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
