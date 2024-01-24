import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false,
      min: 6,
    },
    avatar: { type: String },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    },

  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);