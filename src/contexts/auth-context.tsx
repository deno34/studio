
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  type User, 
  // onAuthStateChanged,
  // getAuth,
  // signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
  // signInWithPopup,
  // GoogleAuthProvider,
  // signOut,
  // type Auth,
  // sendEmailVerification
} from 'firebase/auth';
// import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// import { firebaseConfig } from '@/lib/firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email, password) => Promise<any>;
  signUpWithEmail: (email, password) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  sendVerificationEmail: (user: User) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Set loading to false
  // const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  // useEffect(() => {
    // const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    // const authInstance = getAuth(app);
    // setAuth(authInstance);
    
    // const unsubscribe = onAuthStateChanged(authInstance, (user) => {
    //   setUser(user);
    //   setLoading(false);
    // });
    
    // return () => unsubscribe();
  // }, []);

  const handleSignInWithEmail = async (email, password) => {
    console.log("Firebase is disabled");
    return Promise.resolve();
  }
  
  const handleSignUpWithEmail = async (email, password) => {
     console.log("Firebase is disabled");
    return Promise.resolve();
  }

  const handleSignInWithGoogle = async () => {
    console.log("Firebase is disabled");
    return Promise.resolve();
  }
  
  const handleSendVerificationEmail = async (user: User) => {
     console.log("Firebase is disabled");
    return Promise.resolve();
  }

  const handleSignOut = async () => {
    console.log("Firebase is disabled");
    router.push('/');
  };

  const value = { 
    user, 
    loading, 
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithGoogle: handleSignInWithGoogle,
    sendVerificationEmail: handleSendVerificationEmail,
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
