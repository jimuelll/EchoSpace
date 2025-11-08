import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: "include", // send cookies
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}
