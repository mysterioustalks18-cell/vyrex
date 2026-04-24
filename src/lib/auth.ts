import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// ============================================================
// CREATE OR UPDATE USER IN FIRESTORE
// ============================================================
const createUserRecord = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // New user — create record with 50 free credits
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email?.split('@')[0] || 'Creator',
      photoURL: user.photoURL || null,
      credits: 50,
      plan: 'spark',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    // Existing user — update last login only
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  }
  
  // Return full user data
  const updatedSnap = await getDoc(userRef);
  return updatedSnap.data();
};

// ============================================================
// GOOGLE SIGN IN
// ============================================================
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    
    const result = await signInWithPopup(auth, provider);
    const userData = await createUserRecord(result.user);
    
    return {
      success: true,
      user: result.user,
      userData,
      isNewUser: !userData?.lastLogin
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

// ============================================================
// EMAIL + PASSWORD SIGN UP
// ============================================================
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(result.user);
    
    // Create user record with display name
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email: result.user.email,
      name: name || email.split('@')[0],
      photoURL: null,
      credits: 50,
      plan: 'spark',
      emailVerified: false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
    
    return {
      success: true,
      user: result.user,
      message: `Verification email sent to ${email}. Please verify before signing in.`
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

// ============================================================
// EMAIL + PASSWORD SIGN IN
// ============================================================
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = await createUserRecord(result.user);
    
    return {
      success: true,
      user: result.user,
      userData
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

// ============================================================
// SEND PASSWORD RESET EMAIL
// ============================================================
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: `Reset link sent to ${email}. Check your inbox.`
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: getAuthErrorMessage(authError.code)
    };
  }
};

// ============================================================
// SIGN OUT
// ============================================================
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Sign out failed' };
  }
};

// ============================================================
// AUTH STATE OBSERVER
// ============================================================
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================================
// GET USER DATA FROM FIRESTORE
// ============================================================
export const getUserData = async (uid: string) => {
  try {
    const userSnap = await getDoc(doc(db, 'users', uid));
    return userSnap.exists() ? userSnap.data() : null;
  } catch {
    return null;
  }
};

// ============================================================
// DEDUCT CREDITS
// ============================================================
export const deductCredits = async (uid: string, amount: number) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { success: false };
    
    const currentCredits = userSnap.data().credits || 0;
    if (currentCredits < amount) {
      return { success: false, error: 'Insufficient credits' };
    }
    
    await setDoc(userRef, {
      credits: currentCredits - amount,
      lastActivity: serverTimestamp()
    }, { merge: true });
    
    return { success: true, remainingCredits: currentCredits - amount };
  } catch {
    return { success: false, error: 'Credit deduction failed' };
  }
};

// ============================================================
// HUMAN-READABLE ERROR MESSAGES
// ============================================================
const getAuthErrorMessage = (code: string): string => {
  const errors: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email. Please sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign in cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up blocked by browser. Please allow pop-ups for this site.',
    'auth/cancelled-popup-request': 'Sign in cancelled.',
    'auth/account-exists-with-different-credential': 'Account exists with different sign-in method. Try Google sign-in.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/user-disabled': 'This account has been disabled. Contact support.',
    'auth/requires-recent-login': 'Please sign in again to continue.',
    'auth/invalid-action-code': 'This OTP link has expired. Please request a new one.',
  };
  return errors[code] || `Authentication error: ${code}`;
};
