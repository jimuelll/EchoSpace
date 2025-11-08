import {
  Users,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Eye,
  EyeOff,
  Settings,
  Upload,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { SidebarButton } from "./SidebarButton";
import { JoinCommunityModal } from "../JoinCommunityModal";
import { CreateCommunityModal } from "../CreateCommunityModal";

export function DropdownSection({
  collapsed,
  location,
  closeSidebar,
}: {
  collapsed: boolean;
  location: any;
  closeSidebar?: () => void;
}) {
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const isCommunities =
    location.pathname.startsWith("/communities") ||
    location.pathname.startsWith("/community/");
  const isSettings =
    location.pathname.includes("/settings") ||
    location.pathname.includes("/upload-avatar");

  return (
    <>
      {/* Communities */}
      <SidebarButton
        icon={<Users className="w-5 h-5" />}
        label="Communities"
        collapsed={collapsed}
        active={isCommunities}
        onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
        iconRight={
          !collapsed &&
          (showCommunityDropdown ? <ChevronDown /> : <ChevronRight />)
        }
      />
      {!collapsed && showCommunityDropdown && (
        <div className="ml-8 space-y-2">
          <JoinCommunityModal />
          <CreateCommunityModal>
            <button className="flex items-center gap-2 hover:text-[#3a31d8]">
              <PlusCircle className="w-4 h-4" /> Create Community
            </button>
          </CreateCommunityModal>
          <SidebarButton
            icon={<Eye className="w-4 h-4" />}
            label="Public Communities"
            to="/communities/public"
            collapsed={false}
          />
          <SidebarButton
            icon={<EyeOff className="w-4 h-4" />}
            label="Private Communities"
            to="/communities/private"
            collapsed={false}
          />
        </div>
      )}

      {/* Settings */}
      <SidebarButton
        icon={<Settings className="w-5 h-5" />}
        label="User Settings"
        collapsed={collapsed}
        active={isSettings}
        onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
        iconRight={
          !collapsed &&
          (showSettingsDropdown ? <ChevronDown /> : <ChevronRight />)
        }
      />
      {!collapsed && showSettingsDropdown && (
        <div className="ml-8 space-y-2">
          <SidebarButton
            icon={<Upload className="w-4 h-4" />}
            label="Upload Avatar"
            to="/upload-avatar"
            collapsed={false}
          />
          <button
            onClick={closeSidebar}
            className="flex items-center gap-2 hover:text-[#3a31d8]"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      )}
    </>
  );
}
