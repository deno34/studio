
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
  type Auth,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from '@/lib/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email, password) => Promise<any>;
  signUpWithEmail: (email, password) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  sendVerificationEmail: (user: User) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (displayName: string, photoFile?: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Ensure Firebase is initialized only on the client side
    const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(app);
    setAuth(authInstance);
    
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        // Optional: you could fetch additional user data from Firestore here
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = async (email, password) => {
    if (!auth) throw new Error("Auth not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  const handleSignUpWithEmail = async (email, password) => {
    if (!auth) throw new Error("Auth not initialized");
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const handleSignInWithGoogle = async () => {
    if (!auth) throw new Error("Auth not initialized");
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  }
  
  const handleSendVerificationEmail = async (user: User) => {
    if (!auth) throw new Error("Auth not initialized");
    return sendEmailVerification(user);
  }

  const handleUpdateProfile = async (displayName: string, photoFile?: File) => {
    if (!auth?.currentUser) throw new Error("User not authenticated");
    
    let photoURL = auth.currentUser.photoURL;

    if (photoFile) {
        const app = getApp();
        const storage = getStorage(app);
        const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(auth.currentUser, {
        displayName,
        photoURL
    });

    // Manually update the user state to reflect changes immediately
    setUser({ ...auth.currentUser });
  }

  const handleSignOut = async () => {
    if (!auth) throw new Error("Auth not initialized");
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
