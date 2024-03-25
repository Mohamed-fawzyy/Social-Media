import express from "express";
import { getTotalUsers } from "../controllers/statistcs.js";

const router = express.Router()

router.get("/", getTotalUsers)

export default router;