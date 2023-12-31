const router = require("express").Router();

const swaggerUi = require("swagger-ui-express");
const swagerDocument = require("../swagger.json");

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swagerDocument));

module.exports = router;