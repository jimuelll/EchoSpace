import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const token = localStorage.getItem("token");
console.log("AuthGuard token:", token);

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        console.warn("No valid token found");
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          console.warn("Token rejected by backend:", res.status);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; // or a loading spinner
  if (!isAuthenticated) return <Navigate to="/" />;

  return <>{children}</>;
}
