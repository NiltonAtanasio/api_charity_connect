import express from "express";
const router = express.Router();

import { authMiddleware } from "../middlewares/authMiddlewares.js"
import controllers from "../controllers/userController.js"

router.get("/", authMiddleware, controllers.getAllUsers);
router.post("/register", controllers.createUser);
router.post("/login", controllers.login);
router.patch("/:id", authMiddleware, controllers.updateUserById);
router.delete("/:id", authMiddleware, controllers.deleteUserById);
router.get("/search", authMiddleware, controllers.searchUser);

export default router;