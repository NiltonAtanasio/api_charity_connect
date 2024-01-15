import userSchema from "../models/userSchema.js";

export const findAllService = (offset, limit) => userSchema.find().sort({ _id: -1 }).skip(offset).limit(limit)

export const countUserService = () => userSchema.countDocuments();

export const findUserByEmailService = (email) => userSchema.findOne({ email: email });

export const createUserService = (user) => new userSchema(user).save();


export const findUserById = (id) => userSchema.findById(id);

