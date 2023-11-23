import express from "express";
const router = express.Router();

import { authMiddleware } from "../middlewares/authMiddlewares.js"
import controllers from "../controllers/postController.js"

router.get("/", controllers.getAll);
router.post("/create", authMiddleware, controllers.createPost);
router.get("/search", controllers.searchByTitle);
router.get("/byuser", authMiddleware, controllers.byUser);
router.get("/:id", authMiddleware, controllers.getById);
router.patch("/update/:id", authMiddleware, controllers.postUpdate);
router.delete("/:id", authMiddleware, controllers.postDelete);
router.patch("/like/:id", authMiddleware, controllers.postLike);
router.patch("/comment/:id", authMiddleware, controllers.postComment);
router.patch("/comment/:idPost/:idComment", authMiddleware, controllers.deleteComment);

export default router;