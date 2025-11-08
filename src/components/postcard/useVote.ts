import { useState } from "react";
import { useEffect } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;

type VoteValue = 1 | -1 | 0;

export function useVote({ postId, userId, initialScore, initialVote }: { postId: string; userId: string; initialScore?: number; initialVote?: VoteValue }) {
  const [voteScore, setVoteScore] = useState(initialScore ?? 0);
  const [userVote, setUserVote] = useState<VoteValue>(initialVote ?? 0);

  useEffect(() => {
    const fetchVote = async () => {
      const res = await fetch(`${BASE_URL}/api/voteStatus?userId=${userId}&postId=${postId}`);
      const data = await res.json();
      if (data.success) {
        setUserVote(data.value);
        if (typeof data.score === "number") setVoteScore(data.score);
      }
    };
    if (userId && postId) fetchVote();
  }, [userId, postId]);

  const handleVote = async (value: 1 | -1) => {
    const newVote = userVote === value ? 0 : value;
    const res = await fetch(`${BASE_URL}/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, postId, value: newVote }),
    });
    const data = await res.json();
    if (data.success) {
      setVoteScore(data.score);
      setUserVote(newVote);
    }
  };

  return { voteScore, userVote, handleVote } as const;
}
