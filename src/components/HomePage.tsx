import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext"; // make sure this exists
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme(); // "light" | "dark"
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
          theme === "light"
            ? "bg-[#E7F2EF] text-[#19183B]"
            : "bg-[#19183B] text-[#E7F2EF]"
        }`}
      >
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  // unified colors (same palette as sidebar/header)
  const colors =
    theme === "light"
      ? {
          bg: "bg-[#F3F5F7]",
          text: "text-[#1F2937]",
          card: "bg-white border border-[#E2E8F0]",
          subtext: "text-[#6B7280]",
        }
      : {
          bg: "bg-[#19183B]",
          text: "text-[#E7F2EF]",
          card: "bg-[#222145] border border-[#2F2E5A]",
          subtext: "text-[#AAB3D0]",
        };

  const communities = [
    {
      title: "Public Communities",
      description: "Browse open communities",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-10 w-10 ${colors.text}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20h6M3 20h5v-2a4 4 0 00-4-4H3m0-6h18M4 10V6a4 4 0 014-4h8a4 4 0 014 4v4"
          />
        </svg>
      ),
      path: "/communities/public",
    },
    {
      title: "Private Communities",
      description: "Join with a code or invite",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-10 w-10 ${colors.text}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2v1h4v-1zM6 11V9a6 6 0 1112 0v2m-6 4h.01M4 15h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      path: "/communities/private",
    },
  ];

  return (
    <div
      className={`flex flex-col min-h-screen ${colors.bg} ${colors.text} transition-colors duration-300`}
    >
    <main className="flex-1 overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1
          className={`
            text-4xl font-extrabold tracking-wide 
            bg-gradient-to-r from-[#00FFD1] via-[#00BFFF] to-[#6A5ACD] 
            text-transparent bg-clip-text font-space
          `}
        >
          Welcome Back, {user.name}
        </h1>
        <p className={`mt-1 text-sm ${theme === "dark" ? "text-[#AAB3D0]" : "text-[#708993]"}`}>
          Ready to explore what's new in your communities?
        </p>
      </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {communities.map((item, i) => (
            <motion.div
              key={i}
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`cursor-pointer ${colors.card} rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
            >
              {item.icon}
              <div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className={`text-sm ${colors.subtext}`}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
