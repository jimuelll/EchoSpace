import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { sendVerificationEmail } from "../utils/email.js";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Utility: generate JWT
const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

// Utility: extract token from Authorization header
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  return token && token !== "null" && token !== "undefined" ? token : null;
};

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      if (!existing.isVerified) {
        return res.status(409).json({
          error: "Email already registered but not verified",
          unverified: true,
        });
      }
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        isVerified: false,
        verificationCode,
        codeExpiresAt,
      },
    });

    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Verify email
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isVerified) return res.status(400).json({ error: "Invalid request" });

    const now = new Date();
    if (user.verificationCode !== code || now > user.codeExpiresAt) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null,
        codeExpiresAt: null,
      },
    });

    const token = generateToken(user.id);
    res.status(200).json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Email not verified",
        unverified: true,
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, imageUrl: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Logout (client should just delete token)
router.post("/logout", (_req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Upload profile image
const upload = multer({ dest: "uploads/" });

router.post("/upload-profile", upload.single("image"), async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const imagePath = `/uploads/${req.file.filename}`;

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { imageUrl: imagePath },
    });

    res.json({ success: true, imageUrl: imagePath });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Resend verification code
router.post("/resend", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isVerified) return res.status(400).json({ error: "Invalid request" });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: newCode,
        codeExpiresAt: newExpiry,
      },
    });

    await sendVerificationEmail(email, newCode);
    res.status(200).json({ message: "New verification code sent" });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ error: "Resend failed" });
  }
});

export default router;
