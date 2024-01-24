import { createUserService, deleteUserByIdService, getAllUsersService, getUserByIdService, loginService, searchUserService, updateUserByIdService } from "../services/userService.js"

const createUser = async (req, res) => {
  const { name, email, password, confirmPassword, userName, avatar } = req.body;

  try {
    const token = await createUserService(name, email, password, confirmPassword, userName, avatar)

    return res.status(201).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  };
}

const login = async (req, res) => {
  const user = req.body;

  try {
    const token = await loginService(user);

    return res.status(200).send(token);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getAllUsers = async (req, res) => {
  const { limit, offset } = req.query;
  const currentUrl = req.baseUrl;

  try {
    const results = await getAllUsersService(limit, offset, currentUrl);

    return res.status(200).send(results);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getUserById = async (req, res) => {
  const userId = req.userId;

  try {
    const userFound = await getUserByIdService(userId);

    return res.status(200).send(userFound);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

const updateUserById = async (req, res) => {
  const user = req.body;
  const { id: userId } = req.params;
  const userIdLogged = req.userId;

  try {
    const updatedUser = await updateUserByIdService(user, userId, userIdLogged);

    return res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUserById = async (req, res) => {
  const { id: userId } = req.params;
  const userIdLogged = req.userId;

  try {
    const deletedUser = await deleteUserByIdService(userId, userIdLogged);

    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const searchUser = async (req, res) => {
  const { name } = req.query;

  try {
    const usersFound = await searchUserService(name);

    return res.status(200).json(usersFound);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  login,
  searchUser,
}