import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET;

import { findUserByIdService } from "../services/userService.js";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ msg: "access denied" })
  }

  try {
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) return res.status(401).send({ message: "Invalid token!" });

      const user = await findUserByIdService(decoded.id);

      if (!user || !user._id)
        return res.status(401).send({ message: "Invalid token!" });

      req.userId = user._id

      return next();
    });


  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "invalid token" });
  }
}

export {
  authMiddleware,
}