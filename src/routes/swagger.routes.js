import { Router } from "express";
const router = Router();

import swaggerUi from "swagger-ui-express";
import swagerDocument from "../swagger.json" assert { type: "json" };

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swagerDocument));

export default router;