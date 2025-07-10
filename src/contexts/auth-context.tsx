
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  type User, 
  onAuthStateChanged,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type Auth
} from 'firebase/auth';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from '@/lib/firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email, password) => Promise<any>;
  signUpWithEmail: (email, password) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This code will only run on the client
    const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(app);
    setAuth(authInstance);
    
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = (email, password) => {
    if (!auth) throw new Error("Auth not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  const handleSignUpWithEmail = (email, password) => {
    if (!auth) throw new Error("Auth not initialized");
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const handleSignInWithGoogle = () => {
    if (!auth) throw new Error("Auth not initialized");
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  const handleSignOut = async () => {
    if (!auth) throw new Error("Auth not initialized");
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = { 
    user, 
    loading, 
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithGoogle: handleSignInWithGoogle,
    signOutUser: handleSignOut
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
