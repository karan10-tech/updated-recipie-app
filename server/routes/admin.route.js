// routes/admin.routes.js
import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllRecipesWithDetails,
  deleteRecipeAdmin,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = Router();

// All routes are protected with admin middleware
router.get("/dashboard-stats", verifyAdmin, getDashboardStats);
router.get("/users", verifyAdmin, getAllUsers);
router.delete("/users/:userId", verifyAdmin, deleteUser);
router.get("/recipes", verifyAdmin, getAllRecipesWithDetails);
router.delete("/recipes/:recipeId", verifyAdmin, deleteRecipeAdmin);

export default router;
