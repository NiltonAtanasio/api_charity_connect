import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false
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