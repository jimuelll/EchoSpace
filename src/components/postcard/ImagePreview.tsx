import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;

export function ImagePreview({
  imageUrl,
  title,
  onClick,
}: {
  imageUrl: string;
  title?: string;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);

  return (
    <div
      className="relative w-full mt-4 cursor-pointer"
      onClick={onClick}
    >
      {!isHorizontal && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={`${BASE_URL}${imageUrl}`}
            alt="blurred background"
            className="w-full h-full object-cover scale-110 blur-[40px] brightness-110 saturate-150"
          />
        </div>
      )}
      <div
        className={`relative z-10 border-y border-[#C4D6D3] overflow-hidden flex items-center justify-center ${
          isHorizontal ? "p-0" : "max-h-[400px]"
        }`}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#e0e0e0] via-[#f0f0f0] to-[#e0e0e0]" />
        )}
        <img
          src={`${BASE_URL}${imageUrl}`}
          alt={title || "Post image"}
          loading="lazy"
          onLoad={(e) => {
            setLoaded(true);
            const img = e.currentTarget;
            setIsHorizontal(img.naturalWidth > img.naturalHeight);
          }}
          className={`transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${
            isHorizontal
              ? "w-full h-auto object-cover"
              : "mx-auto h-auto object-contain max-h-[400px]"
          }`}
        />
      </div>
    </div>
  );
}
