// controllers/admin.controller.js
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Recipe } from "../models/recipe.model.js";
import { User } from "../models/user.model.js";

// Dashboard stats
const getDashboardStats = asyncHandler(async (req, resp) => {
  const totalUsers = await User.countDocuments();
  const totalRecipes = await Recipe.countDocuments();

  const popularRecipes = await Recipe.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "savedRecipes",
        as: "savedBy",
      },
    },
    {
      $addFields: {
        saveCount: { $size: "$savedBy" },
      },
    },
    {
      $sort: { saveCount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        name: 1,
        saveCount: 1,
        recipeImg: 1,
        createdAt: 1,
      },
    },
  ]);

  const recentRecipes = await Recipe.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userOwner", "username email");

  resp.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalRecipes,
        popularRecipes,
        recentRecipes,
      },
      "Dashboard stats fetched successfully"
    )
  );
});

// Get all users with pagination
const getAllUsers = asyncHandler(async (req, resp) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  resp.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
      "Users fetched successfully"
    )
  );
});

// Delete user
const deleteUser = asyncHandler(async (req, resp) => {
  const userId = req.params.userId;

  // Delete all recipes by this user
  await Recipe.deleteMany({ userOwner: userId });

  // Remove this user's recipes from other users' saved recipes
  await User.updateMany(
    { savedRecipes: userId },
    { $pull: { savedRecipes: userId } }
  );

  // Delete the user
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  resp
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

// Get all recipes with user details
const getAllRecipesWithDetails = asyncHandler(async (req, resp) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const recipes = await Recipe.find()
    .populate("userOwner", "username email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Recipe.countDocuments();

  resp.status(200).json(
    new ApiResponse(
      200,
      {
        recipes,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
      "Recipes fetched successfully"
    )
  );
});

// Delete recipe (admin)
const deleteRecipeAdmin = asyncHandler(async (req, resp) => {
  const recipeId = req.params.recipeId;

  // Remove from all users' saved recipes
  await User.updateMany(
    { savedRecipes: recipeId },
    { $pull: { savedRecipes: recipeId } }
  );

  const recipe = await Recipe.findByIdAndDelete(recipeId);

  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }

  resp
    .status(200)
    .json(new ApiResponse(200, null, "Recipe deleted successfully"));
});

export {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllRecipesWithDetails,
  deleteRecipeAdmin,
};
