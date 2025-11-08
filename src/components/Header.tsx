import { Bell, Menu, Search, PlusCircle } from "lucide-react";
import logo from "../../src/logo.svg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";

export function Header({ onMobileToggle }: { onMobileToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isHome = location.pathname === "/HomePage";

  return (
    <header
      className={`
        flex items-center justify-between px-6 py-4 shadow-md transition-colors duration-300
        ${theme === "dark"
          ? "bg-[#010104]/80 text-[#eae9fc] border-b border-[#3a31d8]/40 backdrop-blur-md"
          : "bg-[#fbfbfe]/80 text-[#040316] border-b border-[#2f27ce]/40 backdrop-blur-md"}
      `}
    >
      <div className="flex items-center gap-2">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-1 transition ${
              theme === "dark"
                ? "text-[#eae9fc] hover:text-[#a8a3ff]"
                : "text-[#040316] hover:text-[#2f27ce]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium hidden md:inline">Back</span>
          </button>
        )}

        {/* Mobile Sidebar Toggle */}
        <button className="md:hidden" onClick={onMobileToggle}>
          <Menu
            className={`w-6 h-6 transition ${
              theme === "dark" ? "text-[#eae9fc]" : "text-[#040316]"
            }`}
          />
        </button>

        {/* Logo */}
        <button
          onClick={() => navigate("/HomePage")}
          className="flex items-center gap-1 group"
        >
          <img className="w-10 h-10" src={logo} alt="logo" />
          <h1
            className={`
              text-2xl font-extrabold tracking-wide font-orbitron bg-clip-text text-transparent
              bg-gradient-to-r from-[#00FFD1] via-[#00BFFF] to-[#6A5ACD]
              group-hover:opacity-90 transition
            `}
          >
            EchoSpace
          </h1>
        </button>
      </div>

      {/* Search Form (Desktop) */}
    <form
      className={`
        hidden md:flex items-center rounded-full px-3 py-1 w-64 transition
        border backdrop-blur-md
        ${theme === "dark"
          ? "bg-[#0a0a1a]/80 text-[#eae9fc] border-[#3a31d8]/40"
          : "bg-[#f0f1ff]/80 text-[#040316] border-[#2f27ce]/40"}
      `}
    >
        <Search
          className={`w-4 h-7 mr-2 ${
            theme === "dark" ? "text-[#a8a3ff]" : "text-[#2f27ce]"
          }`}
        />
        <input
          type="text"
          placeholder="Search"
          className={`
            bg-transparent outline-none text-sm w-full
            ${theme === "dark" ? "placeholder-[#a8a3ff]" : "placeholder-[#6b6a99]"}
          `}
        />
      </form>

      <nav className="flex items-center gap-4 md:gap-6">
        {/* Mobile Search Button */}
        <button
          onClick={() => toast("Search feature coming soon!")}
          className="md:hidden"
        >
          <Search
            className={`w-6 h-6 transition ${
              theme === "dark"
                ? "text-[#a8a3ff] hover:text-white"
                : "text-[#2f27ce] hover:text-[#0600c2]"
            }`}
          />
        </button>

        {/* Create Post Button (Desktop only) */}
        <button
          onClick={() =>
            toast("The Create Post feature isn't available yet — stay tuned!", {
              icon: "ℹ️",
              duration: 4000,
            })
          }
          className={`
            hidden md:inline-flex items-center gap-2 px-3 py-1 rounded transition
            border
            ${theme === "dark"
              ? "bg-[#3a31d8] border-[#6f64ff] text-white hover:bg-[#0600c2]"
              : "bg-[#2f27ce] border-[#6a5acd] text-white hover:bg-[#0600c2]"}
          `}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Create Post</span>
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative">
            <Bell
              className={`w-6 h-6 transition cursor-pointer ${
                theme === "dark"
                  ? "text-[#a8a3ff] hover:text-white"
                  : "text-[#2f27ce] hover:text-[#0600c2]"
              }`}
            />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`
              transition border mt-1
              ${theme === "dark"
                ? "bg-[#0a0a1a] text-[#eae9fc] border-[#3a31d8]/40"
                : "bg-white text-[#040316] border-[#2f27ce]/40"}
            `}
          >
            <DropdownMenuItem>New comment</DropdownMenuItem>
            <DropdownMenuItem>Vote received</DropdownMenuItem>
            <DropdownMenuItem>Thread reply</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
