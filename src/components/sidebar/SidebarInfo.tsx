import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function UserInfo({
  collapsed,
  closeSidebar,
}: {
  collapsed: boolean;
  closeSidebar?: () => void;
}) {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 border-t border-[#3a31d8]/40">
      <div className={`flex flex-col items-center ${collapsed ? "gap-2" : "gap-3"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} w-full`}>
          <img
            src={`${user?.imageUrl || "/default-avatar.svg"}?t=${Date.now()}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          {!collapsed && (
            <div className="overflow-x-hidden">
              <p className="font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-sm opacity-70 truncate">{user?.email || ''}</p>
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
  );
}
