import UserSchema from "../models/userSchema.js";
import { countUserService, createUserService, findAllService, findUserByEmailService } from "../services/userService.js"
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
      return res.status(400).json({ msg: "There is no registered user" });
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
      msg: "server error, please try again later"
    });
  }
}

const createUser = async (req, res) => {
  try {
    const user = req.body

    //validations 
    if (!user.name) {
      return res.status(422).json({ msg: "the name is required" })
    }

    if (!user.email) {
      return res.status(422).json({ msg: "the email is required" })
    }

    if (!user.userName) {
      return res.status(422).json({ msg: "the user name is required" })
    }

    if (!user.password) {
      return res.status(422).json({ msg: "the password is required" })
    }

    if (user.password !== user.confirmPassword) {
      return res.status(422).json({ msg: "put the same password" })
    }

    if (!user.avatar) {
      return res.status(422).json({ msg: "the avatar is required" })
    }

    const checkEmail = await findUserByEmailService(user.email);

    if (checkEmail) {
      return res.status(422).json({ msg: "email already exists" })
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
      msg: "server error, please try again later"
    });
  }
};

const login = async (req, res) => {
  try {
    const user = req.body;

    // validations
    if (!user.email) {
      return res.status(422).json({ msg: "the email is required" })
    }

    if (!user.password) {
      return res.status(422).json({ msg: "the password is required" })
    }

    // check if user exists
    const checkedUser = await findUserByEmailService(user.email).select('+password');

    if (!checkedUser) {
      return res.status(404).json({ msg: "User not found" })
    }

    // check if password match
    const checkedPassword = authServices.comparePassword(user.password, checkedUser.password);

    if (!checkedPassword) {
      return res.status(422).json({ msg: "invalid password" })
    }

    const token = authServices.generateToken(checkedUser._id)

    res.status(200).json({ msg: "authentication completed successfully", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
}

const updateUserById = async (req, res) => {
  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      message: "Usuário atualizada com sucesso!",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userFound = await UserSchema.findByIdAndDelete(req.params.id);

    res.status(200).json({
      mensagem: `Usuário '${userFound.email}' deletada com sucesso!`,
    });
  } catch (err) {
    res.status(400).json({
      mensagem: err.message,
    });
  }
};

const searchUser = async (req, res) => {
  const id = req.params.id

  // check if user exists
  const user = await UserSchema.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });

}

export default {
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
  login,
  searchUser,
}