'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useUser, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

// Represents the data stored in /users/{userId}
interface UserDocument {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Represents the data stored in /user_roles/{userId}
interface UserRoleDocument {
    roleName: string;
}

// The combined profile object we'll use in the app
export interface UserProfile extends UserDocument {
    roleName: string;
}


interface UserProfileState {
  profile: UserProfile | null;
  isProfileLoading: boolean;
  profileError: Error | null;
}

const UserProfileContext = createContext<UserProfileState | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userDocData, isLoading: isUserDocLoading, error: userDocError } = useDoc<Omit<UserDocument, 'id'>>(userDocRef);

  const userRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'user_roles', user.uid);
  }, [user, firestore]);
  
  const { data: userRoleData, isLoading: isRoleLoading, error: roleError } = useDoc<UserRoleDocument>(userRoleRef);


  const value = useMemo((): UserProfileState => {
    const isLoading = isAuthLoading || isUserDocLoading || isRoleLoading;
    const error = userDocError || roleError;

    if (isLoading || error || !userDocData || !userRoleData || !user) {
      return {
        profile: null,
        isProfileLoading: isLoading,
        profileError: error,
      };
    }
    
    // The check for `user` not being null is important before accessing `user.uid`
    if(user) {
        return {
          profile: {
            ...userDocData,
            id: user.uid,
            roleName: userRoleData.roleName,
          },
          isProfileLoading: false,
          profileError: null,
        };
    }

    // Default return if user is null after loading
    return {
        profile: null,
        isProfileLoading: false,
        profileError: null
    };

  }, [isAuthLoading, isUserDocLoading, isRoleLoading, userDocData, userRoleData, userDocError, roleError, user]);

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
