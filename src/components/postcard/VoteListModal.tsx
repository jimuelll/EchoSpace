import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

type User = {
  name: string;
  imageUrl?: string;
};

export function VoteListModal({
  postId,
  open,
  setOpen,
  theme = "light",
}: {
  postId: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  theme?: "light" | "dark";
}) {
  const [upvoters, setUpvoters] = useState<User[]>([]);
  const [downvoters, setDownvoters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";
  const bg = isDark ? "bg-[#2C2B5A]" : "bg-white";
  const text = isDark ? "text-white" : "text-[#19183B]";
  const subtext = isDark ? "text-[#AAB3D0]" : "text-[#708993]";
  const border = isDark ? "border-[#3a31d8]/40" : "border-gray-200";
  const divider = isDark ? "border-t border-[#3a31d8]/40" : "border-t border-gray-200";
  const avatarBorder = isDark ? "border-[#3a31d8]/40" : "border-gray-300";
  const closeBg = isDark ? "bg-[#3a31d8]/20 hover:bg-[#3a31d8]/30" : "bg-gray-100 hover:bg-gray-200";

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/vote/${postId}/votes`)
      .then((res) => {
        setUpvoters(res.data.upvoters || []);
        setDownvoters(res.data.downvoters || []);
      })
      .catch(() => {
        setUpvoters([]);
        setDownvoters([]);
      })
      .finally(() => setLoading(false));
  }, [open, postId]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <Dialog.Panel
        className={`relative z-10 w-[90%] sm:w-full sm:max-w-md max-h-[80vh] overflow-y-auto rounded-lg p-4 sm:p-6 shadow-xl ${bg} ${text} border ${border}`}
      >
        <Dialog.Title className="text-lg font-semibold mb-4 text-center sm:text-left">
          Voter List
        </Dialog.Title>

        {loading ? (
          <p className={`text-sm ${subtext} text-center`}>Loading...</p>
        ) : (
          <div className="space-y-6">
            {/* Upvoters */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowBigUp
                  className={`w-5 h-5 ${
                    isDark ? "text-[#7F9FFF]" : "text-[#3a31d8]"
                  }`}
                />
                <p className="font-semibold">Upvoted by</p>
              </div>
              {upvoters.length === 0 ? (
                <p className={`text-sm ${subtext}`}>No upvotes yet.</p>
              ) : (
                <ul className="space-y-2">
                  {upvoters.map((user, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <img
                        src={`${BASE_URL}${user.imageUrl || "/default-avatar.svg"}?t=${Date.now()}`}
                        alt="avatar"
                        className={`w-7 h-7 rounded-full object-cover border ${avatarBorder}`}
                      />
                      <span className="text-sm">{user.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={divider} />

            {/* Downvoters */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowBigDown
                  className={`w-5 h-5 ${
                    isDark ? "text-[#FF7F7F]" : "text-[#D83A3A]"
                  }`}
                />
                <p className="font-semibold">Downvoted by</p>
              </div>
              {downvoters.length === 0 ? (
                <p className={`text-sm ${subtext}`}>No downvotes yet.</p>
              ) : (
                <ul className="space-y-2">
                  {downvoters.map((user, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <img
                        src={`${BASE_URL}${user.imageUrl || "/default-avatar.svg"}?t=${Date.now()}`}
                        alt="avatar"
                        className={`w-7 h-7 rounded-full object-cover border ${avatarBorder}`}
                      />
                      <span className="text-sm">{user.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Close button */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <button
            onClick={() => setOpen(false)}
            className={`px-5 py-2 rounded ${closeBg} ${text} text-sm sm:text-base`}
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
