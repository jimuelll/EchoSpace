import {
  Home,
  User,
  UserPlus,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { SidebarButton } from "./SidebarButton";

export function NavSection({ collapsed, location }: { collapsed: boolean; location: any }) {
  const isHome = location.pathname === "/HomePage";

  return (
    <>
      <SidebarButton
        icon={<Home className="w-5 h-5" />}
        label="Home"
        to="/HomePage"
        collapsed={collapsed}
        active={isHome}
      />
      <SidebarButton
        icon={<User className="w-5 h-5" />}
        label="User Profile"
        to="/profile"
        collapsed={collapsed}
      />
      <SidebarButton
        icon={<UserPlus className="w-5 h-5" />}
        label="Friends"
        to="/friends"
        collapsed={collapsed}
      />
      <SidebarButton
        icon={<MessageSquare className="w-5 h-5" />}
        label="Messages"
        to="/messages"
        collapsed={collapsed}
      />
      <SidebarButton
        icon={<Bookmark className="w-5 h-5" />}
        label="Saved Echoes"
        to="/saved"
        collapsed={collapsed}
      />
    </>
  );
}
