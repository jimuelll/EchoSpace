import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";

import { VoteControls } from "./VoteControls";
import { ImageViewer } from "./ImageViewer";
import { PostActions } from "./PostActions";
import { useVote } from "./useVote";
import { ImagePreview } from "./ImagePreview";
import { PostMenu } from "./PostMenu";
import { EditPostModal } from "./EditPostModal";
import { DeletePostModal } from "./DeletePostModal";
import { VoteListModal } from "./VoteListModal";

const BASE_URL = import.meta.env.VITE_API_URL;

type VoteValue = 1 | -1 | 0;

type PostCardProps = {
  title: string;
  content: string;
  imageUrl?: string;
  votes: number;
  author: { name: string; imageUrl?: string };
  createdAt: string;
  updatedAt?: string;
  commentCount?: number;
  postId: string;
  userId: string;
  voteStatus?: VoteValue;
  userRole?: string;
  isAuthor?: boolean;
  refetchPosts?: () => void;
};

export function PostCard({
  title,
  content,
  imageUrl,
  votes,
  author,
  createdAt,
  updatedAt,
  commentCount,
  postId,
  userId,
  voteStatus,
  userRole,
  isAuthor,
  refetchPosts,
}: PostCardProps) {
  const timeAgo = formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark ? "bg-[#1A1A2F]/70" : "bg-white/70";
  const borderColor = isDark ? "border-[#3a31d8]/40" : "border-[#C4D6D3]";
  const shadow = isDark ? "shadow-lg hover:shadow-xl" : "shadow-md hover:shadow-lg";

  const titleColor = isDark ? "text-white" : "text-[#19183B]";
  const contentColor = isDark ? "text-[#AAB3D0]" : "text-[#4A5B57]";
  const metaColor = isDark ? "text-[#AAB3D0]" : "text-[#708993]";

  const [openViewer, setOpenViewer] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [localImageUrl, setLocalImageUrl] = useState(imageUrl);
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);

  const { voteScore, userVote, handleVote } = useVote({
    postId,
    userId,
    initialScore: votes,
    initialVote: voteStatus,
  });

  const canDelete = isAuthor || userRole === "MODERATOR" || userRole === "LEADER";
  const canEdit = isAuthor;
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/post/${id}`, {
        data: { userId },
        withCredentials: true,
      });
      toast.success("Post deleted");
      refetchPosts?.();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };


  return (
    <div className={`relative rounded-xl border ${borderColor} ${shadow} transition overflow-visible ${cardBg} backdrop-blur-md`}>
      {/* Modals */}
      {canEdit && (
        <EditPostModal
          userId={userId}
          open={editOpen}
          setOpen={setEditOpen}
          postId={postId}
          initialTitle={localTitle}
          initialContent={localContent}
          initialImageUrl={localImageUrl}
          theme={theme}
          onUpdated={({ title, content, imageUrl }) => {
            setLocalTitle(title);
            setLocalContent(content);
            setLocalImageUrl(imageUrl || undefined);
            refetchPosts?.();
          }}
        />
      )}

      {canDelete && (
        <DeletePostModal
          open={deleteOpen}
          setOpen={setDeleteOpen}
          onConfirm={handleDelete}
          postId={postId}
          theme={theme}
        />
      )}

      <VoteListModal
        postId={postId}
        open={voteModalOpen}
        setOpen={setVoteModalOpen}
        theme={theme}
      />

      {/* Header */}
      <div className="relative px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${BASE_URL}${author.imageUrl || "/default-avatar.svg"}?t=${Date.now()}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className={`font-semibold ${titleColor}`}>{author.name}</p>
              <p className={`text-xs ${metaColor}`}>
                {timeAgo} {updatedAt && updatedAt !== createdAt && "(edited)"}
              </p>
            </div>
          </div>

          <PostMenu
            postId={postId}
            onEdit={canEdit ? () => setEditOpen(true) : undefined}
            onDelete={canDelete ? () => setDeleteOpen(true) : undefined}
            onViewVotes={() => setVoteModalOpen(true)}
            theme={theme}
          />
        </div>
      </div>

      {/* Image */}
      {localImageUrl && (
        <>
          <ImagePreview imageUrl={localImageUrl} title={localTitle} onClick={() => setOpenViewer(true)} />
          <ImageViewer
            src={`${BASE_URL}${localImageUrl}`}
            title={localTitle}
            open={openViewer}
            setOpen={setOpenViewer}
          />
        </>
      )}

      {/* Content */}
      <div className="p-4 space-y-2">
        {localTitle && <h3 className={`text-lg font-semibold ${titleColor}`}>{localTitle}</h3>}
        <p className={`text-sm ${contentColor} whitespace-pre-line`}>{localContent}</p>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between px-4 py-3 border-t ${borderColor} text-sm ${metaColor}`}>
        <VoteControls voteScore={voteScore} userVote={userVote} onVote={handleVote} />
        <PostActions commentCount={commentCount} />
      </div>
    </div>
  );
}