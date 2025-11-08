import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import communityRoutes from './routes/community.js';
import postRoutes from './routes/post.js';
import voteOnPost from './routes/vote.js';
import voteStatus from "./routes/voteStatus.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5174",
  "https://echo-space-b9t4.vercel.app", // ← your Vercel frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.use('/api/community', communityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/vote", voteOnPost);
app.get("/api/voteStatus", voteStatus);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

