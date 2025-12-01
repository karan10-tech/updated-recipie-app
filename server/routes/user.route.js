import { Router } from "express";
import {registerUser, loginUser,adminLogin} from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.post("/admin-login", adminLogin);  // ADD THIS

export default router