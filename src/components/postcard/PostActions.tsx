import { Send, Repeat, Bookmark, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export function PostActions({ commentCount }: { commentCount?: number }) {
  const handleToast = (msg: string) => toast(msg);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleToast("Sent to friend")}
        className="hover:text-[#19183B] transition-transform duration-200 ease-out hover:scale-110"
      >
        <Send className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToast("Reposted")}
        className="hover:text-[#19183B] transition-transform duration-200 ease-out hover:scale-110"
      >
        <Repeat className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToast("Saved post")}
        className="hover:text-[#19183B] transition-transform duration-200 ease-out hover:scale-110"
      >
        <Bookmark className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToast("View comments")}
        className="flex items-center gap-1 hover:text-[#19183B] transition-transform duration-200 ease-out hover:scale-105"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="transition-opacity duration-200 ease-in">{commentCount ?? 0}</span>
      </button>
    </div>
  );
}
