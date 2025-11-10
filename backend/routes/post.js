import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// ---------------- Cloudinary setup ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "post-images",
    format: "jpg",
    public_id: `${file.fieldname}-${Date.now()}`,
  }),
});
const upload = multer({ storage });

// ---------------- JWT Utility ----------------
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

// ---------------- UPLOAD IMAGE ----------------
router.post("/upload", upload.single("image"), async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // CloudinaryStorage stores the final URL in req.file.path
    const imageUrl = req.file?.path || req.file?.filename || req.file?.url;
    res.json({ success: true, url: imageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ---------------- CREATE POST ----------------
router.post("/create", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { communityId, title, content, imageUrl } = req.body;

    if (!communityId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = await prisma.post.create({
      data: {
        title: title?.trim() || null,
        content: content.trim(),
        imageUrl: imageUrl || null,
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

// ---------------- EDIT POST ----------------
router.patch("/:postId", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const { postId } = req.params;
  const { title, content, imageUrl } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== userId) return res.status(403).json({ error: "Unauthorized" });

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title?.trim() || null,
        content: content?.trim() || post.content,
        imageUrl: imageUrl ?? post.imageUrl,
      },
    });

    res.json({ success: true, post: updated });
  } catch (err) {
    console.error("Edit post error:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// ---------------- DELETE POST ----------------
router.delete("/:id", async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { id } = req.params;

  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, imageUrl: true, communityId: true },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    const membership = await prisma.membership.findUnique({
      where: { userId_communityId: { userId, communityId: post.communityId } },
      select: { role: true },
    });

    const allowedRoles = ["LEADER", "MODERATOR"];
    const isAuthor = post.authorId === userId;
    const isPrivileged = allowedRoles.includes(membership?.role || "");

    if (!isAuthor && !isPrivileged) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    // Delete image from Cloudinary if exists
    if (post.imageUrl) {
      const publicId = post.imageUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        cloudinary.uploader.destroy(`post-images/${publicId}`, (err, result) => {
          if (err) console.error("Failed to delete image:", err);
        });
      }
    }

    await prisma.post.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
