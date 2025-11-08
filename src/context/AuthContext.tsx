import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  const logout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setUser(null);
        toast.success("Logged out");
        navigate("/");
      } else {
        toast.error(data.error || "Logout failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refetchUser: fetchUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
