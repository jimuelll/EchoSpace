import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useTheme } from "@/context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export function CreateCommunityModal({
  children,
  onCreated,
}: {
  children: React.ReactNode;
  onCreated?: (community: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [image, setImage] = useState<string | undefined>();
  const cropperRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

const isDark = theme === "dark";
const bgColor = isDark ? "bg-[#19183B]" : "bg-[#F9FAFA]";
const textColor = isDark ? "text-white" : "text-[#19183B]";
const inputBorder = isDark ? "border-[#3C3B63]" : "border-[#C4D6D3]";
const inputBg = isDark ? "bg-[#2C2B5A]" : "bg-white";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      toast.success("Image loaded and ready to crop.");
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Community name is required");
      return;
    }

    setLoading(true);
    try {
      let bannerUrl: string | undefined;

      if (image && cropperRef.current?.cropper) {
        const canvas = cropperRef.current.cropper.getCroppedCanvas();
        if (!canvas) {
          toast.error("Failed to generate cropped image.");
          return;
        }

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b: any) => resolve(b), "image/png")
        );

        if (!blob) {
          toast.error("Failed to convert image to blob.");
          return;
        }

        const formData = new FormData();
        formData.append("image", blob, "banner.png");

        const uploadRes = await axios.post(
          `${BASE_URL}/api/community/upload`,
          formData,
          { withCredentials: true }
        );

        bannerUrl = uploadRes.data.url;
      }

      const res = await axios.post(
        `${BASE_URL}/api/community/create`,
        {
          name,
          type: isPrivate ? "PRIVATE" : "PUBLIC",
          avatarUrl: bannerUrl,
          description: description || undefined,
        },
        { withCredentials: true }
      );

      toast.success("Community created!");
      onCreated?.(res.data.community);

      setOpen(false);
      setName("");
      setDescription("");
      setImage(undefined);
      setIsPrivate(false);
    } catch (err: any) {
      console.error("Create error:", err);
      toast.error(err?.response?.data?.error || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  // The modal content we will portal to body
  const modalContent = open ? (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={() => setOpen(false)}
    >
      <div
        className={`relative w-full max-w-md rounded-xl shadow-lg ${bgColor} ${textColor} p-6 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className={`absolute top-3 right-3 hover:opacity-80 ${
            isDark ? "text-gray-300" : "text-[#708993]"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Community</h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 rounded text-sm ${inputBg} ${textColor} border ${inputBorder} focus:outline-none`}
              placeholder="e.g. Echo Builders"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 rounded text-sm ${inputBg} ${textColor} border ${inputBorder} focus:outline-none`}
              rows={3}
              placeholder="What is this community about?"
            />
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Banner Image (optional)
            </label>
            <label
              className={`${
                isDark ? "bg-[#3a31d8]" : "bg-[#3a31d8]"
              } text-white px-4 py-2 rounded hover:opacity-90 cursor-pointer block text-center mb-6`}
            >
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Cropper */}
          {image && (
            <div className="flex justify-center mb-4">
              <Cropper
                src={image}
                ref={cropperRef}
                style={{ width: "100%", maxWidth: 600, height: 192 }}
                aspectRatio={3}
                guides={false}
                viewMode={1}
                background={false}
                responsive
                autoCropArea={1}
                checkOrientation={false}
                className="rounded shadow-md"
              />
            </div>
          )}

          {/* Privacy Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              className="accent-[#19183B]"
            />
            <label className="text-sm">Make this community private</label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#3a31d8] text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Community"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      {open && createPortal(modalContent, document.body)}
    </>
  );
}
