import express from "express";
const app = express();

app.use(express.json());

import cors from "cors";
app.use(cors());

import db from "./config/database.js";
db.connect();

import userRoutes from "./routes/user.routes.js"
app.use("/user", userRoutes);

import postRoutes from "./routes/post.routes.js"
app.use("/post", postRoutes);

import swaggerRoutes from "./routes/swagger.routes.cjs"
app.use("/doc", swaggerRoutes);



export default app;