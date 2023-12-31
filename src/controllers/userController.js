import UserSchema from "../models/userSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET;


const getAll = async (req, res) => {
  try {
    const users = await UserSchema.find();
    res.status(200).json(users);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
}

const createUser = async (req, res) => {

  const user = req.body

  //validations 
  if (!user.name) {
    return res.status(422).json({ msg: "the name is required" })
  }

  if (!user.email) {
    return res.status(422).json({ msg: "the email is required" })
  }

  if (!user.password) {
    return res.status(422).json({ msg: "the password is required" })
  }

  if (user.password !== user.confirmPassword) {
    return res.status(422).json({ msg: "put the same password" })
  }

  const checkEmail = await UserSchema.findOne({ email: user.email })

  if (checkEmail) {
    return res.status(422).json({ msg: "email already exists" })
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;

    const newUser = new UserSchema(user);
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User added successfully!",
      user: {
        name: savedUser.name,
        userName: savedUser.userName,
        email: savedUser.email,
        id: savedUser._id,
        createdAt: savedUser.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
};

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

const login = async (req, res) => {
  const user = req.body;

  // validations
  if (!user.email) {
    return res.status(422).json({ msg: "the email is required" })
  }

  if (!user.password) {
    return res.status(422).json({ msg: "the password is required" })
  }

  // check if user exists
  const checkUser = await UserSchema.findOne({ email: user.email }).select('+password')

  if (!checkUser) {
    return res.status(404).json({ msg: "User not found" })
  }

  // check if password match
  const checkPassword = await bcrypt.compareSync(user.password, checkUser.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "invalid password" })
  }

  try {
    const token = jwt.sign({
      id: checkUser._id
    }, SECRET)

    res.status(200).json({ msg: "authentication completed successfully", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
}

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
  getAll,
  createUser,
  updateUserById,
  deleteUserById,
  login,
  searchUser,
}