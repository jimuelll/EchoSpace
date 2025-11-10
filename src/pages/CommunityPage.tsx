import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PostCard } from "@/components/postcard";
import { CreatePostModal } from "@/components/CreatePostModal";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function CommunityPage() {
  const { id } = useParams();
  const { theme } = useTheme();
  const { user } = useAuth();

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#19183B]" : "bg-[#F9FAFA]";
  const textColor = isDark ? "text-white" : "text-[#19183B]";
  const subtextColor = isDark ? "text-[#AAB3D0]" : "text-[#708993]";
  const bannerBg = isDark ? "bg-[#2C2B5A]" : "bg-[#C4D6D3]";
  const buttonPrimary = isDark
    ? "bg-[#3a31d8] text-white hover:bg-[#C4C4F0]"
    : "bg-[#3a31d8] text-white hover:bg-[#C4C4F0]";

  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchCommunity = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/community/${id}`, {
        withCredentials: true,
      });

      setCommunity(res.data.community);
      setPosts(res.data.posts || []);
      setUserRole(res.data.userRole || null);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load community");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgColor} ${textColor}`}>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgColor} ${textColor}`}>
        <p className="text-lg font-medium">Community not found</p>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Banner */}
        <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
          {community.avatarUrl ? (
            <img
              src={`${resolveImageUrl(community.avatarUrl)}?t=${Date.now()}`}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`${bannerBg} w-full h-full flex items-center justify-center text-sm ${subtextColor}`}
            >
              No banner uploaded
            </div>
          )}
        </div>

        {/* Info */}
        <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
        <p className={`mb-6 ${subtextColor}`}>Join Code: {community.joinCode}</p>

        {/* Create Post Button */}
        <CreatePostModal communityId={community.id} onPosted={fetchCommunity}>
          <button
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full shadow-lg transition ${buttonPrimary}`}
            aria-label="Create Post"
          >
            + Create Post
          </button>
        </CreatePostModal>

        {/* Posts */}
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <p className={subtextColor}>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                content={post.content}
                imageUrl={post.imageUrl}
                votes={post.votes}
                commentCount={post.commentCount}
                createdAt={post.createdAt}
                author={post.author}
                postId={post.id}
                userId={user?.id || ""}
                voteStatus={post.voteStatus}
                userRole={userRole || ""}
                isAuthor={post.authorId === user?.id}
                updatedAt={post.updatedAt}
                refetchPosts={fetchCommunity}
              />
            ))
          )}
        </div>
      </main>

      {/* Sidebar */}
      <aside
        className={`hidden lg:block w-80 p-6 border-l ${
          isDark ? "border-[#3a31d8]/40 bg-[#2C2B5A]" : "border-[#A1C2BD] bg-[#F9FAFA]"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Sidebar Placeholder</h2>
        <div className={`space-y-4 ${subtextColor}`}>
          <p>🧠 Trending Topics</p>
          <p>📌 Pinned Posts</p>
          <p>🎨 Community Controls</p>
          <p>🔗 Community Links</p>
        </div>
      </aside>
    </div>
  );
}
