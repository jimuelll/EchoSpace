import { prisma } from "../lib/prisma.js";
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, postId, value } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ error: "Missing userId or postId" });
  }

  if (![1, -1, 0].includes(value)) {
    return res.status(400).json({ error: "Invalid vote value" });
  }

  try {
    const existingVote = await prisma.vote.findFirst({
      where: { userId, postId },
    });

    if (!existingVote && value !== 0) {
    const created = await prisma.vote.create({
        data: { userId, postId, value },
    });
    } else if (existingVote && value === 0) {
    const deleted = await prisma.vote.delete({
        where: { id: existingVote.id },
    });
    } else if (existingVote && existingVote.value !== value) {
    const updated = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { value },
    });
    }

    const votes = await prisma.vote.findMany({ where: { postId } });
    const score = votes.reduce((sum, v) => sum + v.value, 0);

    res.json({ success: true, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process vote" });
  }
});

router.get("/:id/votes", async (req, res) => {
  const { id } = req.params;

  try {
    const votes = await prisma.vote.findMany({
      where: { postId: id },
      include: {
        user: {
          select: { name: true, imageUrl: true },
        },
      },
    });

    const upvoters = votes.filter(v => v.value === 1).map(v => v.user);
    const downvoters = votes.filter(v => v.value === -1).map(v => v.user);

    res.json({ upvoters, downvoters });
  } catch (err) {
    console.error("Vote fetch error:", err);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
});

export default router;
