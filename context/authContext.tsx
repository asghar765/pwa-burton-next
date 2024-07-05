// context/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: string | null;
  setUser: (user: User | null) => void;
  setUserRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(true);
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          const userDocRef = doc(db, "users", authUser.uid);
          try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const savedUser = localStorage.getItem('user');
              const savedUserRole = localStorage.getItem('userRole');

              if (!savedUser || !savedUserRole || JSON.parse(savedUser).uid !== authUser.uid || savedUserRole !== userData.role) {
                localStorage.setItem('user', JSON.stringify(authUser));
                localStorage.setItem('userRole', userData.role);
              }

              setUser(authUser);
              setUserRole(userData.role);
            } else {
              console.error("User document does not exist in Firestore.");
              setUser(null);
              setUserRole(null);
              localStorage.removeItem('user');
              localStorage.removeItem('userRole');
            }
          } catch (error) {
            console.error('Error fetching user document from Firestore:', error);
          }
        } else {
          setUser(null);
          setUserRole(null);
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
        }
        setLoading(false);
      }, (error) => {
        console.error('Error observing auth state:', error);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, loading, userRole, setUser, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
