import { Router } from "express";
import {
    addLike,
    createMessage,
    getMessages,
} from "../controllers/messageController.js";

const router: Router = Router();

router.get("/", getMessages);

router.post("/", createMessage);

router.post("/:id/like", addLike);

export default router;
