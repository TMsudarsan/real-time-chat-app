import express from "express"
import { productRoute } from "../middleware/athu.middleware.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";


const router = express.Router();

router.get("/users", productRoute , getUserForSidebar);
router.get("/:id", productRoute, getMessages);

router.post("/send/:id",productRoute,sendMessage)

export default router;