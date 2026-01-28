// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, getIdTokenResult, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'user' | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Forzamos la recarga del token para obtener los claims más recientes
        const idTokenResult = await getIdTokenResult(currentUser, true);
        let role = (idTokenResult.claims.role as string) || 'user';
        
        // Temporal: si el email es admin@alfredsmart.com, asignar rol admin
        if (currentUser.email === 'admin@alfredsmart.com') {
          role = 'admin';
        }
        
        setUserRole(role as 'admin' | 'user');

        // Guardar el token en cookie para el middleware
        const token = await currentUser.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
      } else {
        setUserRole(null);
        // Limpiar la cookie cuando no hay usuario
        document.cookie = '__session=; path=/; max-age=0';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};