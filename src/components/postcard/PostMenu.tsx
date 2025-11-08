import { MoreHorizontal, Pencil, Trash2, Lock, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function PostMenu({
  postId,
  onEdit,
  onDelete,
  onViewVotes,
  theme = "light",
}: {
  postId: string;
  onEdit?: () => void;
  onDelete?: (postId: string) => void;
  onViewVotes?: () => void;
  theme?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = theme === "dark";

  const iconColor = isDark ? "text-[#AAB3D0]" : "text-[#708993]";
  const iconHover = isDark ? "hover:text-white" : "hover:text-[#19183B]";
  const menuBg = isDark ? "bg-[#2C2B5A]" : "bg-white";
  const borderColor = isDark ? "border-[#3a31d8]/40" : "border-gray-200";
  const hoverBg = isDark ? "hover:bg-[#3a31d8]/20" : "hover:bg-gray-100";
  const textColor = isDark ? "text-white" : "text-[#19183B]";
  const dangerColor = isDark ? "text-red-400" : "text-red-600";
  const divider = isDark ? "border-t border-[#3a31d8]/40" : "border-t border-gray-200";

  return (
    <div ref={menuRef} className="absolute top-3 right-3 z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`${iconColor} ${iconHover} transition`}
      >
        <MoreHorizontal
          className={`w-5 h-5 transition ${
            isDark ? "text-[#AAB3D0] hover:text-white" : "text-[#708993] hover:text-[#19183B]"
          }`}
        />
      </button>

      {open && (
        <div className={`absolute right-0 mt-2 w-44 rounded shadow-lg ${menuBg} ${borderColor} border`}>
          {onEdit && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${hoverBg} ${textColor}`}
            >
              <Pencil className="w-4 h-4" /> Edit Post
            </button>
          )}
          <div className={divider} />
          {onDelete && (
            <button
              onClick={() => {
                setOpen(false);
                onDelete(postId);
              }}
              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${hoverBg} ${dangerColor}`}
            >
              <Trash2 className="w-4 h-4" /> Delete Post
            </button>
          )}
          <div className={divider} />
          <button
            onClick={() => {
              setOpen(false);
              // Placeholder for future private post logic
            }}
            className={`flex items-center gap-2 px-4 py-2 w-full text-left ${hoverBg} ${textColor}`}
          >
            <Lock className="w-4 h-4" /> Private Post
          </button>
          <div className={divider} />
          {onViewVotes && (
            <button
              onClick={() => {
                setOpen(false);
                onViewVotes();
              }}
              className={`flex items-center gap-2 px-4 py-2 w-full text-left ${hoverBg} ${textColor}`}
            >
              <Users className="w-4 h-4" /> View Voter List
            </button>
          )}
        </div>
      )}
    </div>
  );
}
