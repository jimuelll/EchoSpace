import { Dialog } from "@headlessui/react";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export function DeletePostModal({
  open,
  setOpen,
  onConfirm,
  postId,
  theme = "light",
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onConfirm: (postId: string) => Promise<void>;
  postId: string;
  theme?: "light" | "dark";
}) {
  const [loading, setLoading] = useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "bg-[#2C2B5A]" : "bg-white";
  const text = isDark ? "text-white" : "text-[#19183B]";
  const danger = isDark
    ? "bg-red-500 hover:bg-red-600"
    : "bg-red-600 hover:bg-red-700";
  const cancel = isDark
    ? "bg-[#3a31d8]/20 hover:bg-[#3a31d8]/30"
    : "bg-gray-100 hover:bg-gray-200";

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(postId);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && setOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <Dialog.Panel
          className={`relative z-10 w-full max-w-sm md:max-w-md rounded-lg p-6 shadow-xl ${bg} ${text} border border-gray-200 dark:border-[#3a31d8]/40`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-6 h-6" />
            <Dialog.Title className="text-lg font-semibold">
              Delete Post
            </Dialog.Title>
          </div>

          <Dialog.Description className="mb-6 text-sm leading-relaxed">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Dialog.Description>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={() => setOpen(false)}
              disabled={loading}
              className={`px-4 py-2 rounded ${cancel} ${text} transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${danger} transition flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
