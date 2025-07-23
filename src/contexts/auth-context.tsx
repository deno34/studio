
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  type User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/client';
import { uploadFileToStorage } from '@/lib/storage.client';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  sendVerificationEmail: (user: User) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (displayName: string, photoFile?: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  const handleSignUpWithEmail = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const handleSignInWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  }
  
  const handleSendVerificationEmail = async (user: User) => {
    return sendEmailVerification(user);
  }

  const handleUpdateProfile = async (displayName: string, photoFile?: File) => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    let photoURL = auth.currentUser.photoURL;

    if (photoFile) {
        const path = `profile-pictures/${auth.currentUser.uid}`;
        photoURL = await uploadFileToStorage(photoFile, path);
    }

    await updateProfile(auth.currentUser, {
        displayName,
        photoURL
    });

    // Create a new user object to force re-render in components
    setUser(JSON.parse(JSON.stringify(auth.currentUser)));
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const value = { 
    user, 
    loading, 
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithGoogle: handleSignInWithGoogle,
    sendVerificationEmail: handleSendVerificationEmail,
    signOutUser: handleSignOut,
    updateUserProfile: handleUpdateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
