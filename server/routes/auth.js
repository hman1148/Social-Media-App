import express from "express";
import { login } from "../controllers/auth.js";


// tells express that all our routes will be configured
const router = express.Router();

router.post("/login", login);

export default router;