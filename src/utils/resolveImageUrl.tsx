const BASE_URL = import.meta.env.VITE_API_URL;

export function resolveImageUrl(url?: string) {
  if (!url) return `${BASE_URL}/default-avatar.svg`;
  if (url.startsWith("https//")) url = url.replace("https//", "https://");
  if (url.startsWith("http//")) url = url.replace("http//", "http://");
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  return `${BASE_URL}${url}`;
}
