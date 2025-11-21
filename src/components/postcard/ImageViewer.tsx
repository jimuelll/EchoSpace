import { Dialog } from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

export function ImageViewer({
  src,
  title,
  open,
  setOpen,
}: {
  src: string;
  title?: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [touchStartX, setTouchStartX] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

const handleDownload = async () => {
  try {
    const resolvedUrl = resolveImageUrl(src);
    const response = await fetch(resolvedUrl, { mode: "cors" });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = src.split("/").pop()?.split("?")[0] || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
  }
};

  const handleZoomClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMobile) return;

    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const originX = (offsetX / rect.width) * 100;
    const originY = (offsetY / rect.height) * 100;

    img.style.transformOrigin = `${originX}% ${originY}%`;
    setZoom((z) => (z === 1 ? 2 : 1));
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <Dialog.Panel
        className={`relative w-full ${isMobile ? "h-full" : "max-w-5xl"} p-4 flex items-center justify-center`}
        onClick={handleBackdropClick}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(deltaX) > 100) setOpen(false);
        }}
      >
        {/* Unified Top Controls (Mobile + Desktop) */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
            onClick={handleDownload}
            className="bg-white/80 text-[#19183B] p-2 rounded-full shadow hover:bg-[#F0F0F0] transition backdrop-blur"
            aria-label="Download image"
        >
            <Download className="w-5 h-5" />
        </button>
        <button
            onClick={() => setOpen(false)}
            className="bg-white/80 text-[#19183B] p-2 rounded-full shadow hover:bg-[#F0F0F0] transition backdrop-blur"
            aria-label="Close viewer"
        >
            <span className="text-lg font-bold">×</span>
        </button>
        </div>
        {/* Image Container */}
        <div
          className="relative z-10"
          style={{
            touchAction: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <img
            ref={imageRef}
            src={src}
            alt={title || "Post image"}
            className={`block object-contain ${
              zoom === 1 ? "cursor-zoom-in" : "cursor-zoom-out"
            }`}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.3s ease",
              maxWidth: isMobile ? "100vw" : "auto",
              maxHeight: isMobile ? "100vh" : "90vh",
            }}
            onClick={handleZoomClick}
          />
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
