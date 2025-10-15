import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth, functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';

type User = {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean; // Made optional to bypass verification checks
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; success: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any; success: boolean }>;
  signOut: () => Promise<{ error: any; success: boolean }>;
  resetPassword: (email: string) => Promise<{ error: any; success: boolean }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Firebase user to our User type
  const formatUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    // Bypass email verification check by setting to true or omitting
    emailVerified: true, // Always consider users verified
  });

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        setUser(formatUser(firebaseUser));
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Send email verification but don't require it for access
      // This is optional as per requirements
      await sendEmailVerification(userCredential.user);
      
      // Welcome email will be sent automatically by Firebase Cloud Function
      // No need to call sendWelcomeEmail here
      
      return { error: null, success: true };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { error: error.message, success: false };
    } finally {
      setLoading(false);
    }
  };

  // Welcome email is now handled by Firebase Cloud Functions
  // No need for client-side email sending

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Best-effort welcome email on login for users who missed it on signup
      try {
        const sendWelcome = httpsCallable(functions, 'sendWelcomeEmailOnLogin');
        await sendWelcome({});
      } catch (e) {
        // ignore non-critical email errors
        console.warn('sendWelcomeEmailOnLogin failed:', e);
      }

      return { error: null, success: true };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { error: error.message, success: false };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      await firebaseSignOut(auth);
      
      return { error: null, success: true };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { error: error.message, success: false };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      await sendPasswordResetEmail(auth, email);
      
      return { error: null, success: true };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { error: error.message, success: false };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}