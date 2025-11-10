import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JoinCommunityModal } from "@/components/JoinCommunityModal";
import { CreateCommunityModal } from "@/components/CreateCommunityModal";
import { useTheme } from "@/context/ThemeContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function PublicCommunitiesPage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  const isDark = theme === "dark";

  const bgColor = isDark ? "bg-[#19183B]" : "bg-[#F9FAFA]";
  const textColor = isDark ? "text-white" : "text-[#19183B]";
  const subtextColor = isDark ? "text-[#AAB3D0]" : "text-[#708993]";
  const cardBg = isDark
    ? "bg-white/5 border border-white/20 backdrop-blur-md"
    : "bg-white border border-[#E2E8F0]";
  const bannerBg = isDark ? "bg-[#2C2B5A]" : "bg-[#F0F4F8]";
  const buttonPrimary = isDark
    ? "bg-[#3a31d8] text-white hover:bg-[#C4C4F0]"
    : "bg-[#3a31d8] text-white hover:bg-[#C4C4F0";
  interface Community {
    id: string;
    name: string;
    avatarUrl?: string;
  }

  const [communities, setCommunities] = useState<Community[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);


  const fetchCommunities = async () => {
    try {
      setLoadingCommunities(true);
      const res = await axios.get(`${BASE_URL}/api/community/public`, {
        withCredentials: true,
      });
      setCommunities(res.data.communities);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoadingCommunities(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);


  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgColor} ${textColor}`}>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`flex min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Public Communities</h1>
        <p className={`mb-6 ${subtextColor}`}>Browse open communities you can join freely.</p>

        {/* Community Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <CreateCommunityModal onCreated={fetchCommunities}>
            <button className={`px-6 py-3 rounded-lg text-sm font-medium transition ${buttonPrimary}`}>
              + Create Community
            </button>
          </CreateCommunityModal>

          <div className={`px-6 py-3 rounded-lg text-sm font-medium transition ${buttonPrimary}`}>
            <JoinCommunityModal
              onJoined={(newCommunity) => {
                setCommunities((prev) => {
                  const exists = prev.some((c) => c.id === newCommunity.id);
                  return exists ? prev : [...prev, newCommunity];
                });
              }}
            />
          </div>
        </div>

        {/* Community Cards or Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCommunities ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse ${cardBg} rounded-xl shadow-sm overflow-hidden flex flex-col`}
                style={{ aspectRatio: "1 / 1" }}
              >
                <div className={`${bannerBg} h-4/5`} />
                <div className="flex-1 p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-400/30 dark:bg-white/20" />
                  <div className="h-3 w-1/2 rounded bg-gray-300/20 dark:bg-white/10" />
                </div>
              </div>
            ))
          ) : communities.length > 0 ? (
            communities.map((community) => (
              <div
                key={community.id}
                onClick={() => navigate(`/community/${community.id}`)}
                className={`cursor-pointer ${cardBg} rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col`}
                style={{ aspectRatio: "1 / 1" }}
              >
                <div className={`${bannerBg} flex items-center justify-center h-4/5`}>
                  {community.avatarUrl ? (
                    <img
                      src={community.avatarUrl}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className={`text-sm ${subtextColor}`}>No banner uploaded</span>
                  )}
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{community.name}</h2>
                    <p className={`text-sm ${subtextColor}`}>Public Community</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`col-span-full text-center py-10 ${subtextColor}`}>
              <p className="text-base">No public communities found.</p>
              <p className="text-sm mt-2">Try creating one or joining with a code above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
