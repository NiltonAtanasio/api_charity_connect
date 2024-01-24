import authServices from "../services/authServices.js";
import { countUserRepository, createUserRepository, deleteUserByIdRepository, findAllRepository, findUserByEmailRepository, findUserByIdRepository, searchUserByNameRepository, updateUserRepository } from "../repositories/userRepositories.js";

export const createUserService = async (name, email, password, confirmPassword, userName, avatar) => {
  if (!name || !userName || !email || !password || !confirmPassword || !avatar)
    throw new Error("Submit all fields for registration");

  if (password !== confirmPassword) throw new Error("Put the same password");

  if (password.length < 6) throw new Error("Put at least 6 characters");

  const checkEmail = await findUserByEmailRepository(email);

  if (checkEmail) throw new Error("Email already exists");

  password = authServices.generateHashedPassword(password);

  const savedUser = await createUserRepository({
    name,
    userName,
    email,
    password,
    avatar
  }
  );

  if (!savedUser) throw new Error("Error creating User");

  const token = authServices.generateToken(savedUser._id);

  return token;
};

export const loginService = async (user) => {
  if (!user.email) throw new Error("Email is required");

  if (!user.password) throw new Error("Password is required");

  const checkedUser = await findUserByEmailRepository(user.email).select("+password");

  if (!checkedUser) throw new Error("User not found");

  const checkedPassword = authServices.comparePassword(user.password, checkedUser.password);

  if (!checkedPassword) throw new Error("Invalid password");

  const token = authServices.generateToken(checkedUser._id);

  return token;
}

export const getAllUsersService = async (limit, offset, currentUrl) => {
  limit = Number(limit);
  offset = Number(offset);

  if (!limit) {
    limit = 15;
  }
  if (!offset) {
    offset = 0;
  }

  const users = await findAllRepository(offset, limit)
  const total = await countUserRepository();

  const next = offset + limit;
  const nextUrl = next < total ? `${currentUrl}?limit=${limit}offset=${next}` : null;

  const previous = offset - limit < 0 ? null : offset - limit;
  const previousUrl = previous != null ? `${currentUrl}?limit=${limit}offset=${previous}` : null;

  if (users.length === 0) throw new Error("There is no registered user");

  return {
    results: users,
    nextUrl,
    previousUrl,
    limit,
    offset,
    total
  }
}

export const getUserByIdService = async (userId) => {
  if (!userId) throw new Error("Id is required");

  const userFound = await findUserByIdRepository(userId);

  if (userFound.length === 0) throw new Error("User not found");

  return userFound;
}

export const updateUserByIdService = async (user, userId, userIdLogged) => {
  let { name, userName, email, password, avatar } = user;

  if (!name && !userName && !email && !password && !avatar) throw new Error("Submit at least one field to update the user");

  if (!userId) throw new Error("Id is required");

  const foundUser = await findUserByIdRepository(userId);

  if (foundUser._id.toString() != userIdLogged.toString()) throw new Error("You can't update this user");

  password = authServices.generateHashedPassword(password);

  const updatedUser = await updateUserRepository(userIdLogged, name, userName, email, password, avatar);

  return { message: "User successfully updated!" };
};

export const deleteUserByIdService = async (userId, userIdLogged) => {
  if (!userId) throw new Error("Id is required");

  const foundUser = await findUserByIdRepository(userId);

  if (!foundUser) throw new Error("User not found");

  if (foundUser._id.toString() != userIdLogged.toString()) throw new Error("You can't delete this user");

  const deletedUser = await deleteUserByIdRepository(userIdLogged);

  return deletedUser;
}

export const searchUserService = async (userName) => {
  if (!userName) throw new Error("User name is required");

  const usersFound = await searchUserByNameRepository(userName);

  if (usersFound.length === 0) throw new Error("There is no user with this user name");

  return {
    results: usersFound.map((item) => ({
      id: item._id,
      name: item.name,
      userName: item.userName,
      avatar: item.avatar
    }))
  };
}
