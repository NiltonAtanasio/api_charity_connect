import userSchema from "../models/userSchema.js";

export const createUserRepository =
  (
    name,
    userName,
    email,
    password,
    avatar
  ) => new userSchema(
    name,
    userName,
    email,
    password,
    avatar
  ).save();

export const findUserByEmailRepository = (email) => userSchema.findOne({ email });

export const findAllRepository = (
  offset,
  limit) => userSchema.find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)

export const countUserRepository = () => userSchema.countDocuments();

export const findUserByIdRepository = (id) => userSchema.findById(id);

export const updateUserRepository = (
  userIdLogged,
  name,
  userName,
  email,
  password,
  avatar
) => userSchema.findOneAndUpdate(
  {
    _id: userIdLogged
  }, {
  name,
  userName,
  email,
  password,
  avatar
},
  { rawResult: true, new: true });

export const deleteUserByIdRepository = (id) => userSchema.findByIdAndDelete(id);

export const searchUserByNameRepository = (name) => userSchema.find(
  {
    userName: {
      $regex: `${name || ""}`,
      $options: "i"
    }
  })
  .sort({ _id: -1 });

