import { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function UploadAvatarPage() {
  const { updateUser, refetchUser } = useAuth();
  const { theme } = useTheme(); // "light" | "dark"
  const cropperRef = useRef<any>(null);
  const [image, setImage] = useState<string | undefined>();
  const [preview, setPreview] = useState<string | null>(null);
  const [mobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const isDark = theme === "dark";

  const bgColor = isDark ? "bg-[#19183B]" : "bg-[#F9FAFA]";
  const textColor = isDark ? "text-white" : "text-[#19183B]";
  const cardBg = isDark ? "bg-white/5 border border-white/20 backdrop-blur-md" : "bg-white border border-[#E2E8F0]";
  const buttonPrimary = isDark
    ? "bg-[#3a31d8] text-white hover:bg-[#C4C4F0]"
    : "bg-[#3a31d8] text-white hover:bg-[#C4C4F0";
  const inputBorder = isDark ? "border-[#3C3B63]" : "border-[#C4D6D3]";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      toast.success("Image loaded. Ready to crop.");
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      toast.error("Cropper not ready.");
      return;
    }
    const croppedDataUrl = cropper.getCroppedCanvas().toDataURL("image/png");
    setPreview(croppedDataUrl);
    toast.success("Image cropped. Ready to upload.");
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error("Please crop your image before uploading.");
      return;
    }
    try {
      const blob = await (await fetch(preview)).blob();
      const formData = new FormData();
      formData.append("image", blob, "avatar.png");

      const res = await axios.post(
        `${BASE_URL}/api/auth/upload-profile`,
        formData,
        { withCredentials: true }
      );

      updateUser({ imageUrl: res.data.imageUrl });
      toast.success("Profile picture updated!");
      refetchUser();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className={`flex min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6 flex justify-center items-start">
          <div className={`rounded-xl shadow-md p-6 w-full max-w-md ${cardBg}`}>
            <h1 className="text-3xl font-bold mb-6 text-center">Upload Profile Picture</h1>

            <label
              className={`px-4 py-2 rounded cursor-pointer block text-center mb-6 ${buttonPrimary}`}
            >
              Choose File
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {image && (
              <div className="flex justify-center mb-6">
                <Cropper
                  src={image}
                  ref={cropperRef}
                  style={{ width: "100%", maxWidth: 300, height: 300 }}
                  aspectRatio={1}
                  guides={false}
                  viewMode={1}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  className="rounded shadow-md"
                />
              </div>
            )}

            <div className="flex justify-center gap-4 mb-6">
              <button onClick={handleCrop} className={`px-4 py-2 rounded ${buttonPrimary}`}>
                Preview Crop
              </button>
              <button onClick={handleUpload} className={`px-4 py-2 rounded ${buttonPrimary}`}>
                Upload
              </button>
            </div>

            {preview && (
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-2">Preview</h2>
                <img
                  src={preview}
                  alt="Cropped Preview"
                  className={`w-32 h-32 rounded-full object-cover border ${inputBorder}`}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
