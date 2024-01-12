import userSchema from "../models/userSchema.js";

export const findAllService = (offset, limit) => userSchema.find().sort({ _id: -1 }).skip(offset).limit(limit)

export const countUser = () => userSchema.countDocuments();

export const findUserById = (id) => userSchema.findById(id);

