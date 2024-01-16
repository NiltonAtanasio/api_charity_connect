import userSchema from "../models/userSchema.js";

export const findAllService = (offset, limit) => userSchema.find().sort({ _id: -1 }).skip(offset).limit(limit)

export const countUserService = () => userSchema.countDocuments();

export const findUserByEmailService = (email) => userSchema.findOne({ email });

export const createUserService = (user) => new userSchema(user).save();

export const updateUserService = (id, body) => userSchema.findOneAndUpdate({ _id: id }, body, { rawResult: true, new: true });

export const findUserByIdService = (id) => userSchema.findById(id);

