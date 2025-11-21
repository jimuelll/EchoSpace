import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { resolveImageUrl } from "@/utils/resolveImageUrl"; 

const BASE_URL = import.meta.env.VITE_API_URL;

export function EditPostModal({
  open,
  setOpen,
  postId,
  userId,
  initialTitle,
  initialContent,
  initialImageUrl,
  initialImageId,
  onUpdated,
  theme = "light",
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  postId: string;
  userId: string;
  initialTitle?: string;
  initialContent: string;
  initialImageUrl?: string | null;
  initialImageId?: string | null;
  onUpdated: (updatedPost: {
    title: string;
    content: string;
    imageUrl?: string | null;
    imageId?: string | null;
  }) => void;
  theme?: "light" | "dark";
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(initialContent);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [, setImageId] = useState<string | null>(initialImageId || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(resolveImageUrl(initialImageUrl)); 
    } else {
      setImagePreview(null);
    }
    setImageId(initialImageId || null);
  }, [initialImageUrl, initialImageId]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageId(null); 
  }
};

const handleRemoveImage = () => {
  setImageFile(null);
  setImagePreview(null);
  setImageId(null);
};

const handleSubmit = async () => {
  setLoading(true);
  try {
    let newImageUrl: string | null | undefined;
    let newImageId: string | null | undefined;

    if (imageFile) {
      // New image uploaded - this will delete old image and upload new one
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await axios.post(`${BASE_URL}/api/post/upload`, formData, {
        withCredentials: true,
      });
      newImageUrl = uploadRes.data.url;
      newImageId = uploadRes.data.id; 
    } else if (!imagePreview && initialImageUrl) {
      // Image was explicitly removed - send null to trigger deletion
      newImageUrl = null;
      newImageId = null;
    } else if (imagePreview && initialImageUrl) {
      // Keep existing image - don't send these fields at all
      newImageUrl = undefined;
      newImageId = undefined;
    } else {
      // No image initially and no image now
      newImageUrl = null;
      newImageId = null;
    }

    const payload: any = {
      userId,
      title,
      content,
    };

    // Only include image fields if they're defined
    if (newImageUrl !== undefined) {
      payload.imageUrl = newImageUrl;
    }
    if (newImageId !== undefined) {
      payload.imageId = newImageId;
    }

    await axios.patch(
      `${BASE_URL}/api/post/${postId}`,
      payload,
      { withCredentials: true }
    );

    toast.success("Post updated");
    onUpdated({ 
      title, 
      content, 
      imageUrl: newImageUrl === undefined ? initialImageUrl : newImageUrl, 
      imageId: newImageId === undefined ? initialImageId : newImageId 
    });
    setOpen(false);
  } catch (err) {
    toast.error("Failed to update post");
    console.error("Update error:", err);
  } finally {
    setLoading(false);
  }
};

  const isDark = theme === "dark";
  const panelBg = isDark ? "bg-[#2C2B5A]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-[#19183B]";
  const inputBg = isDark
    ? "bg-[#19183B] text-white border-[#3a31d8]/40"
    : "bg-white text-[#19183B] border-gray-300";
  const buttonCancel = isDark
    ? "bg-[#3a31d8]/20 text-white hover:bg-[#3a31d8]/30"
    : "bg-gray-100 text-[#19183B] hover:bg-gray-200";
  const buttonSave = isDark
    ? "bg-[#3a31d8] text-white hover:bg-[#5b4eff]"
    : "bg-[#3a31d8] text-white hover:bg-[#5b4eff]";

  return (
    <Dialog
      open={open}
      onClose={() => !loading && setOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <Dialog.Panel
          className={`relative w-full max-w-md sm:max-w-lg rounded-lg p-6 shadow-xl border border-gray-200 dark:border-[#3a31d8]/40 ${panelBg} ${textColor} max-h-[90vh] overflow-y-auto`}
        >
          <Dialog.Title className="text-lg font-semibold mb-4">Edit Post</Dialog.Title>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={`w-full mb-3 px-3 py-2 border rounded ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#3a31d8]`}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className={`w-full h-40 px-3 py-2 border rounded resize-none ${inputBg} focus:outline-none focus:ring-2 focus:ring-[#3a31d8]`}
          />

          <label className="block mt-4">
            <span className="text-sm font-medium mb-1 block">Update Image</span>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className={`w-full text-sm py-2 px-4 rounded font-semibold transition ${buttonSave}`}
              >
                Choose Image
              </button>
            </div>
          </label>

          {imagePreview && (
          <div className="relative mt-3 flex justify-center">
            <div className="w-full max-w-full h-[200px] sm:h-[300px] overflow-hidden rounded border flex items-center justify-center bg-black/5">
              <img
                src={imageFile ? imagePreview : resolveImageUrl(imagePreview)} 
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white/80 text-[#19183B] p-1 rounded-full shadow hover:bg-white transition"
              aria-label="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end mt-6 gap-3">
            <button
              onClick={() => setOpen(false)}
              disabled={loading}
              className={`px-4 py-2 rounded transition ${buttonCancel} ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 rounded font-semibold transition ${buttonSave} ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
