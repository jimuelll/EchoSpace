import {
  Home,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Eye,
  EyeOff,
  Upload,
  Pencil,
  User,
  MessageSquare,
  Bookmark,
  UserPlus,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { JoinCommunityModal } from "../JoinCommunityModal";
import { useNavigate, useLocation } from "react-router-dom";
import { CreateCommunityModal } from "../CreateCommunityModal";
import { useTheme } from "@/context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_URL;

type SidebarProps = {
  closeSidebar?: () => void;
  onToggleCollapse?: (collapsed: boolean) => void;
};

export function Sidebar({ closeSidebar, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarBg = isDark
    ? "bg-[#010104]/80 text-[#eae9fc] border-r border-[#3a31d8]/40"
    : "bg-[#fbfbfe]/80 text-[#040316] border-r border-[#2f27ce]/40";
  const divider = isDark ? "border-[#3a31d8]/40" : "border-[#2f27ce]/40";
  const hoverBg = "hover:bg-[#3a31d8]/20";
  const activeBg = "bg-gradient-to-r from-[#3a31d8]/90 to-[#0600c2]/90 text-white";

  const toggleCollapse = () => {
    if (window.innerWidth < 768 && closeSidebar) closeSidebar();
    else {
      const newValue = !collapsed;
      setCollapsed(newValue);
      onToggleCollapse?.(newValue);
    }
  };

  if (!user) return null;

  const isHome = location.pathname === "/HomePage";
  const isCommunities =
    location.pathname.startsWith("/communities") ||
    location.pathname.startsWith("/community/");
  const isSettings =
    location.pathname.includes("/settings") ||
    location.pathname.includes("/upload-avatar");

  return (
    <aside
      className={`h-screen transition-[width] duration-300 ease-in-out overflow-x-hidden ${
        collapsed ? "w-20" : "w-64"
      } ${sidebarBg} backdrop-blur-md`}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Button */}
        <div className={`flex justify-end p-4 border-b ${divider}`}>
          <button onClick={toggleCollapse}>
            <Menu className="w-6 h-6 opacity-80 hover:opacity-100 transition" />
          </button>
        </div>

        {/* Scrollable Nav */}
        <nav
          className={`flex-1 overflow-y-auto p-4 space-y-2 
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          [&::-webkit-scrollbar-track]:bg-transparent
          ${isDark
            ? "[&::-webkit-scrollbar-thumb]:bg-[#3a31d8]/40 hover:[&::-webkit-scrollbar-thumb]:bg-[#3a31d8]/60"
            : "[&::-webkit-scrollbar-thumb]:bg-[#2f27ce]/30 hover:[&::-webkit-scrollbar-thumb]:bg-[#2f27ce]/50"}`
          }
      >
          {/* Home */}
          <button
            onClick={() => navigate("/HomePage")}
            className={`flex items-center gap-3 px-2 py-2 rounded transition-all ${
              isHome ? activeBg + " shadow-md" : hoverBg
            }`}
          >
            <Home className="w-5 h-5" />
            {!collapsed && <span>Home</span>}
          </button>

          <hr className={`my-2 ${divider}`} />

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className={`flex items-center gap-3 px-2 py-2 rounded transition ${hoverBg}`}
          >
            <User className="w-5 h-5" />
            {!collapsed && <span>User Profile</span>}
          </button>

          <hr className={`my-2 ${divider}`} />

          {/* Friends */}
          <button
            onClick={() => navigate("/friends")}
            className={`flex items-center gap-3 px-2 py-2 rounded transition ${hoverBg}`}
          >
            <UserPlus className="w-5 h-5" />
            {!collapsed && <span>Friends</span>}
          </button>

          <hr className={`my-2 ${divider}`} />

          {/* Messages */}
          <button
            onClick={() => navigate("/messages")}
            className={`flex items-center gap-3 px-2 py-2 rounded transition ${hoverBg}`}
          >
            <MessageSquare className="w-5 h-5" />
            {!collapsed && <span>Messages</span>}
          </button>

          <hr className={`my-2 ${divider}`} />

          {/* Saved Echoes */}
          <button
            onClick={() => navigate("/saved")}
            className={`flex items-center gap-3 px-2 py-2 rounded transition ${hoverBg}`}
          >
            <Bookmark className="w-5 h-5" />
            {!collapsed && <span>Saved Echoes</span>}
          </button>

          <hr className={`my-2 ${divider}`} />

          {/* Communities */}
          <button
            onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
            className={`flex items-center justify-between w-full px-2 py-2 rounded transition-all ${
              isCommunities ? activeBg : hoverBg
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              {!collapsed && <span>Communities</span>}
            </div>
            {!collapsed &&
              (showCommunityDropdown ? <ChevronDown /> : <ChevronRight />)}
          </button>

          {!collapsed && showCommunityDropdown && (
            <div className="ml-8 space-y-2">
              <JoinCommunityModal />
              <CreateCommunityModal>
                <button className="flex items-center gap-2 hover:text-[#3a31d8]">
                  <PlusCircle className="w-4 h-4" /> Create Community
                </button>
              </CreateCommunityModal>
              <button
                onClick={() => navigate("/communities/public")}
                className="flex items-center gap-2 hover:text-[#3a31d8]"
              >
                <Eye className="w-4 h-4" /> Public Communities
              </button>
              <button
                onClick={() => navigate("/communities/private")}
                className="flex items-center gap-2 hover:text-[#3a31d8]"
              >
                <EyeOff className="w-4 h-4" /> Private Communities
              </button>
            </div>
          )}

          <hr className={`my-2 ${divider}`} />

          {/* Settings */}
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className={`flex items-center justify-between w-full px-2 py-2 rounded transition-all ${
              isSettings ? activeBg : hoverBg
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              {!collapsed && <span>User Settings</span>}
            </div>
            {!collapsed &&
              (showSettingsDropdown ? <ChevronDown /> : <ChevronRight />)}
          </button>

          {!collapsed && showSettingsDropdown && (
            <div className="ml-8 space-y-2">
              <button
                onClick={() => navigate("/upload-avatar")}
                className="flex items-center gap-2 hover:text-[#3a31d8]"
              >
                <Upload className="w-4 h-4" /> Upload Avatar
              </button>
              <button
                onClick={closeSidebar}
                className="flex items-center gap-2 hover:text-[#3a31d8]"
              >
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          )}

          <hr className={`my-2 ${divider}`} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-2 py-2 rounded transition ${hoverBg}`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5 text-yellow-400" />
                {!collapsed && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-[#2f27ce]" />
                {!collapsed && <span>Dark Mode</span>}
              </>
            )}
          </button>
        </nav>

        {/* Bottom User Info */}
        <div className={`p-4 border-t ${divider}`}>
          <div className={`flex flex-col items-center ${collapsed ? "gap-2" : "gap-3"}`}>
            <div className={`flex items-center ${collapsed ? "justify-center"
              : "gap-3"
            } w-full`}
          >
            <img
              src={`${BASE_URL}${user?.imageUrl || "/default-avatar.svg"}?t=${Date.now()}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            {!collapsed && (
              <div className="overflow-x-hidden">
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-sm opacity-70 truncate">{user.email}</p>
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              logout();
              closeSidebar?.();
            }}
            className={`w-full bg-[#3a31d8] hover:bg-[#0600c2] text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  </aside>
);
}