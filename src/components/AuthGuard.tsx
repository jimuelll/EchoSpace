// src/components/AuthGuard.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_URL;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; // or loading spinner
  if (!isAuthenticated) return <Navigate to="/" />;

  return <>{children}</>;
}
