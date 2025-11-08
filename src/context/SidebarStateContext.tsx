import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type SidebarStateContextType = {
  collapsed: boolean; // for desktop
  toggleCollapse: () => void;
  setCollapsed: (value: boolean) => void;
  isSidebarOpen: boolean; // for mobile
  setIsSidebarOpen: (value: boolean) => void;
};

const SidebarStateContext = createContext<SidebarStateContextType | undefined>(
  undefined
);

export const SidebarStateProvider = ({ children }: { children: ReactNode }) => {
  // Desktop collapse state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // Mobile overlay state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <SidebarStateContext.Provider
      value={{ collapsed, toggleCollapse, setCollapsed, isSidebarOpen, setIsSidebarOpen }}
    >
      {children}
    </SidebarStateContext.Provider>
  );
};

export const useSidebarState = () => {
  const context = useContext(SidebarStateContext);
  if (!context) {
    throw new Error("useSidebarState must be used within a SidebarStateProvider");
  }
  return context;
};
