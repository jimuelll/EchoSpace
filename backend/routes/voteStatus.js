import { prisma } from "../lib/prisma.js";

export default async function voteStatus(req, res) {
  const { userId, postId } = req.query;

  if (!userId || !postId) {
    return res.status(400).json({ error: "Missing userId or postId" });
  }

  try {
    const vote = await prisma.vote.findFirst({
      where: { userId, postId },
    });

    res.json({
      success: true,
      value: vote?.value ?? 0, // 1, -1, or 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vote status" });
  }
}