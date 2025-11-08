import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function VoteControls({
  voteScore,
  userVote,
  onVote,
}: {
  voteScore: number;
  userVote: 1 | -1 | 0;
  onVote: (value: 1 | -1) => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const activeUp = isDark ? "text-[#7F9FFF]" : "text-[#3a31d8]";
  const activeDown = isDark ? "text-[#FF7F7F]" : "text-[#D83A3A]";
  const neutral = isDark ? "text-[#AAB3D0]" : "text-[#708993]";
  const hover = isDark ? "hover:text-white" : "hover:text-[#19183B]";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onVote(1)}
        className={`transition-transform duration-200 ease-out hover:scale-110 ${
          userVote === 1 ? activeUp : `${neutral} ${hover}`
        }`}
      >
        <ArrowBigUp className={`w-5 h-5 ${userVote === 1 ? "fill-current" : ""}`} />
      </button>
      <span className={`font-medium ${neutral}`}>{voteScore}</span>
      <button
        onClick={() => onVote(-1)}
        className={`transition-transform duration-200 ease-out hover:scale-110 ${
          userVote === -1 ? activeDown : `${neutral} ${hover}`
        }`}
      >
        <ArrowBigDown className={`w-5 h-5 ${userVote === -1 ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
