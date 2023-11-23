import userSchema from "../models/userSchema.js";

const findUserById = (id) => userSchema.findById(id);

export {
  findUserById,
}