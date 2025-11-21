import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export function CreatePostModal({
  communityId,
  onPosted,
  children,
}: {
  communityId: string;
  onPosted?: () => void;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgColor = isDark ? "bg-[#19183B]" : "bg-[#F9FAFA]";
  const textColor = isDark ? "text-white" : "text-[#19183B]";
  const inputBorder = isDark ? "border-[#3C3B63]" : "border-[#C4D6D3]";
  const inputBg = isDark ? "bg-[#2C2B5A]" : "bg-white";
  const buttonPrimary = isDark
    ? "bg-[#3a31d8] text-white hover:bg-[#C4C4F0]"
    : "bg-[#3a31d8] text-white hover:bg-[#C4C4F0]";
  const subtextColor = isDark ? "text-[#AAB3D0]" : "text-[#708993]";

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

    const handleSubmit = async () => {
      if (!content.trim()) {
        toast.error("Post content is required");
        return;
      }

      setLoading(true);
      try {
        let imageUrl: string | undefined;
        let imageId: string | undefined;

        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);
          const uploadRes = await axios.post(`${BASE_URL}/api/post/upload`, formData, {
            withCredentials: true,
          });
          imageUrl = uploadRes.data.url;
          imageId = uploadRes.data.id;  
        }

        await axios.post(
          `${BASE_URL}/api/post/create`,
          {
            communityId,
            title: title || undefined,
            content,
            imageUrl,
            imageId,   
          },
          { withCredentials: true }
        );

        toast.success("Post created!");
        onPosted?.();
        setOpen(false);
        setTitle("");
        setContent("");
        setImageFile(null);
        setImagePreview(null);
      } catch (err: any) {
        console.error("Post error:", err);
        toast.error(err?.response?.data?.error || "Failed to create post");
      } finally {
        setLoading(false);
      }
    };
  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto flex items-center justify-center px-4 py-10">
          <div className={`w-full max-w-md rounded-lg shadow-lg relative ${bgColor} ${textColor} border ${inputBorder}`}>
            <button
              onClick={() => setOpen(false)}
              className={`absolute top-3 right-3 ${subtextColor} hover:${textColor}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-2">Create Post</h2>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 ${inputBg} ${inputBorder} border ${inputBorder} focus:ring-[#A1C2BD]`}
                placeholder="Title (optional)"
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-4 py-2 rounded text-sm resize-none focus:outline-none focus:ring-2 ${inputBg} ${inputBorder} border ${inputBorder} focus:ring-[#A1C2BD]`}
                rows={4}
                placeholder="What's on your mind?"
              />

              <label className="block">
                <span className="text-sm font-medium mb-1 block">Attach Image</span>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className={`w-full text-sm py-2 px-4 rounded font-semibold transition ${buttonPrimary}`}
                  >
                    Choose Image
                  </button>
                </div>
              </label>

              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded border"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white text-[#19183B] p-1 rounded-full shadow hover:bg-[#F0F0F0] transition"
                    aria-label="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-2 rounded transition disabled:opacity-50 ${buttonPrimary}`}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
