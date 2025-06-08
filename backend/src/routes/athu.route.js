import express from "express";
import { checkauth, login, logout, signin, updateProfile } from "../controllers/athu.controller.js";
import { productRoute } from "../middleware/athu.middleware.js";

const router = express.Router();

router.post("/signup", signin);
router.post("/login",login);
router.post("/logout", logout);

router.put("/update-profile",productRoute,updateProfile);

router.get("/check",productRoute,checkauth)

export default router;
