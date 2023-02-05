import express from "express";
import {getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.router();

/* READ */ 
router.get("/", verifyToken, getFeedPosts);

