import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role?: string;
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
  const interceptorRef = useRef(false);

  // Initialize Axios interceptor once
  useEffect(() => {
    if (!interceptorRef.current) {
      axios.defaults.baseURL = BASE_URL;

      axios.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      interceptorRef.current = true;
    }
  }, []);

  // Fetch current user
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/api/auth/me"); // interceptor adds token
      setUser(res.data);
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
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out");
      navigate("/");
    } catch (err: any) {
      console.error("Logout error:", err);
      toast.error(err?.response?.data?.error || "Logout failed");
    }
  };

  useEffect(() => {
    fetchUser(); // auto-load user on mount
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
