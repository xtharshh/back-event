import express from "express";
import { getUserNotifications } from "../controllers/notification.controller.js";
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.get("/getMyNotifications", isAuthenticated, getUserNotifications);

export default router;
