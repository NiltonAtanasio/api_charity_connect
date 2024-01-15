import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET;

function generateHashedPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function generateToken(id) {
  return jwt.sign({ id: id }, SECRET);
}

export default {
  generateToken,
  generateHashedPassword,
}

