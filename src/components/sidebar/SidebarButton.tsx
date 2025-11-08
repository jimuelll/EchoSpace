import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type SidebarButtonProps = {
  icon: ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
  collapsed: boolean;
  active?: boolean;
  hoverBg?: string;
  activeBg?: string;
  iconRight?: ReactNode;
};

export function SidebarButton({
  icon,
  label,
  to,
  onClick,
  collapsed,
  active = false,
  hoverBg = "hover:bg-[#3a31d8]/20",
  activeBg = "bg-gradient-to-r from-[#3a31d8]/90 to-[#0600c2]/90 text-white",
  iconRight,
}: SidebarButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-3 px-2 py-2 rounded transition-all ${
        active ? `${activeBg} shadow-md` : hoverBg
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {icon}
          {!collapsed && <span className="ml-3">{label}</span>}
        </div>
        {iconRight && <div className="ml-2">{iconRight}</div>}
      </div>
    </button>
  );
}
