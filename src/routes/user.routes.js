import express from "express";
const router = express.Router();

import { authMiddleware } from "../middlewares/authMiddlewares.js"
import controllers from "../controllers/userController.js"

router.post("/register", controllers.createUser);
router.post("/login", controllers.login);
router.get("/", authMiddleware, controllers.getAllUsers);
router.get("/findbyid", authMiddleware, controllers.getUserById);
router.patch("/:id", authMiddleware, controllers.updateUserById);
router.delete("/delete/:id", authMiddleware, controllers.deleteUserById);
router.get("/search", authMiddleware, controllers.searchUser);

export default router;