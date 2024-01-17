import { countUserService, createUserService, deleteUserByIdService, findAllService, findUserByEmailService, searchUserByNameService, updateUserService } from "../services/userService.js"
import authServices from "../services/authServices.js";


const getAllUsers = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 15;
    }
    if (!offset) {
      offset = 0;
    }

    const users = await findAllService(offset, limit);
    const total = await countUserService();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}?limit=${limit}offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}?limit=${limit}offset=${previous}` : null;

    if (users.length === 0) {
      return res.status(400).json({ message: "There is no registered user" });
    }

    res.status(200).json({
      results: users,
      nextUrl,
      previousUrl,
      limit,
      offset,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error, please try again later"
    });
  }
}

const createUser = async (req, res) => {
  try {
    const user = req.body

    //validations 
    if (!user.name) {
      return res.status(422).json({ message: "the name is required" })
    }

    if (!user.email) {
      return res.status(422).json({ message: "the email is required" })
    }

    if (!user.userName) {
      return res.status(422).json({ message: "the user name is required" })
    }

    if (!user.password) {
      return res.status(422).json({ message: "the password is required" })
    }

    if (user.password !== user.confirmPassword) {
      return res.status(422).json({ message: "put the same password" })
    }

    if (!user.avatar) {
      return res.status(422).json({ message: "the avatar is required" })
    }

    const checkEmail = await findUserByEmailService(user.email);

    if (checkEmail) {
      return res.status(422).json({ message: "email already exists" })
    }

    user.password = authServices.generateHashedPassword(user.password)

    const savedUser = await createUserService(user);

    const token = authServices.generateToken(savedUser._id)

    res.status(201).json({
      message: "User added successfully!",
      user: {
        name: savedUser.name,
        userName: savedUser.userName,
        email: savedUser.email,
        id: savedUser._id,
        createdAt: savedUser.createdAt
      },
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error, please try again later"
    });
  }
};

const login = async (req, res) => {
  try {
    const user = req.body;

    // validations
    if (!user.email) {
      return res.status(422).json({ message: "the email is required" })
    }

    if (!user.password) {
      return res.status(422).json({ message: "the password is required" })
    }

    // check if user exists
    const checkedUser = await findUserByEmailService(user.email).select('+password');

    if (!checkedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    // check if password match
    const checkedPassword = authServices.comparePassword(user.password, checkedUser.password);

    if (!checkedPassword) {
      return res.status(422).json({ message: "invalid password" })
    }

    const token = authServices.generateToken(checkedUser._id)

    res.status(200).json({ message: "authentication completed successfully", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error, please try again later"
    });
  }
}

const updateUserById = async (req, res) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body);

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error, please try again later"
    });
  }
};

const deleteUserById = async (req, res) => {
  try {

    const userFound = await deleteUserByIdService(req.params.id)

    res.status(200).json({
      mensage: `User '${userFound.email}' successfully deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error, please try again later"
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const { name } = req.query;

    const usersFound = await searchUserByNameService(name);

    if (usersFound.length === 0) {
      return res.status(400).json({ message: "There is no user with this user name" })
    };

    return res.status(200).json({
      results: usersFound.map((item) => ({
        name: item.name,
        userName: item.userName,
        avatar: item.avatar
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error, please try again later"
    });
  }
}

export default {
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
  login,
  searchUser,
}