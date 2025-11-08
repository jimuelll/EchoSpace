import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

function getUserIdFromToken(req) {
  const token = req.cookies?.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

router.post("/create", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { communityId, title, content, imageUrl } = req.body;

    if (!communityId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = await prisma.post.create({
    data: {
        title,
        content,
        imageUrl,
        community: { connect: { id: communityId } },
        author: { connect: { id: userId } },
    },
    });

    res.json({ success: true, post });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.patch("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId, title, content, imageUrl } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== userId) return res.status(403).json({ error: "Unauthorized" });

    if (imageUrl === null && post.imageUrl) {
      let imageFilename = post.imageUrl.startsWith("/uploads/")
        ? post.imageUrl.replace("/uploads/", "")
        : post.imageUrl;

      const filePath = path.join(__dirname, "..", "uploads", imageFilename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
        else console.log("Deleted image:", imageFilename);
      });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        imageUrl: imageUrl ?? null,
      },
    });

    res.json({ success: true, post: updated });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { id } = req.params;

  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        authorId: true,
        imageUrl: true,
        communityId: true,
      },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    const membership = await prisma.membership.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId: post.communityId,
        },
      },
      select: { role: true },
    });

    const allowedRoles = ["LEADER", "MODERATOR"];
    const isAuthor = post.authorId === userId;
    const isPrivileged = allowedRoles.includes(membership?.role || "");

    if (!isAuthor && !isPrivileged) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    if (post.imageUrl) {
      const imageFilename = post.imageUrl.split("/").pop();
      const filePath = path.join(__dirname, "..", "uploads", imageFilename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
        else console.log("Deleted image:", imageFilename);
      });
    }

    await prisma.post.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});


export default router;
