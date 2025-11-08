import { Sidebar } from "../components/sidebar";
import { Header } from "../components/Header";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, loading } = useTheme();

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#1A1F2B] text-[#EDEDED]"
          : "bg-[#E7F2EF] text-[#19183B]"
      }`}
    >
      {/* Global Theme Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="text-lg font-semibold animate-pulse">
              Applying Theme...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Sidebar */}
      <div
        className={`hidden md:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar
          onToggleCollapse={setCollapsed}
          closeSidebar={() => setMobileOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col relative z-0 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <header className="sticky top-0 z-30">
          <Header onMobileToggle={() => setMobileOpen(true)} />
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden bg-black/40 transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-screen w-64 shadow-lg overflow-y-auto transform transition-transform duration-300 ${
            theme === "dark" ? "bg-[#2A303E]" : "bg-[#708993]"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar closeSidebar={() => setMobileOpen(false)} />
        </div>
      </div>
    </div>
  );
}
