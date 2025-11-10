import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "community-images",
    format: "jpg", // convert all to jpg
    public_id: `${file.fieldname}-${Date.now()}`,
  }),
});
const upload = multer({ storage });

// Decode JWT token
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

// ---------------- JOIN COMMUNITY ----------------
router.post("/join", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const community = await prisma.community.findUnique({ where: { joinCode: code } });
    if (!community) return res.status(404).json({ error: "Invalid code" });

    await prisma.membership.create({
      data: {
        community: { connect: { id: community.id } },
        user: { connect: { id: userId } },
      },
    });

    res.json({ success: true, community });
  } catch (err) {
    console.error("Join error:", err);
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Already joined this community" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- CREATE COMMUNITY ----------------
router.post("/create", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const { name, type = "PRIVATE", avatarUrl } = req.body;
  if (!name || typeof name !== "string") return res.status(400).json({ error: "Community name is required" });
  if (!["PUBLIC", "PRIVATE"].includes(type)) return res.status(400).json({ error: "Invalid community type" });
  if (avatarUrl && typeof avatarUrl !== "string") return res.status(400).json({ error: "Invalid avatar URL" });

  try {
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const community = await prisma.community.create({
      data: {
        name,
        type,
        joinCode,
        avatarUrl,
        memberships: {
          create: {
            user: { connect: { id: userId } },
            role: "LEADER",
          },
        },
      },
    });

    res.json({ success: true, community });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- UPLOAD COMMUNITY AVATAR ----------------
router.post("/upload", upload.single("image"), async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imagePath = req.file.path; // Cloudinary URL
    res.json({ success: true, url: imagePath });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ---------------- FETCH COMMUNITY (WITH POSTS + VOTES) ----------------
router.get("/:id", async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { id } = req.params;

  try {
    const community = await prisma.community.findUnique({
      where: { id },
      select: { id: true, name: true, joinCode: true, type: true, avatarUrl: true, createdAt: true },
    });

    if (!community) return res.status(404).json({ error: "Community not found" });

    const membership = await prisma.membership.findUnique({
      where: { userId_communityId: { userId, communityId: id } },
      select: { role: true },
    });

    const posts = await prisma.post.findMany({
      where: { communityId: id },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, imageUrl: true } },
        votes: { select: { userId: true, value: true } },
      },
    });

    const formattedPosts = posts.map((post) => {
      const totalVotes = post.votes.reduce((sum, v) => sum + v.value, 0);
      const userVote = post.votes.find((v) => v.userId === userId)?.value || 0;
      return { ...post, votes: totalVotes, voteStatus: userVote, authorId: post.author.id };
    });

    res.json({ community, posts: formattedPosts, userRole: membership?.role || null });
  } catch (err) {
    console.error("Fetch community error:", err);
    res.status(500).json({ error: "Failed to fetch community" });
  }
});

export default router;
