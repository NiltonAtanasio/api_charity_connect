import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  image: {
    type: String,
    require: true
  },
  text: {
    type: String,
    require: true
  },
  likes: {
    type: Array,
    require: true
  },
  comments: {
    type: Array,
    require: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  }
},
  { timestamps: true });

export default mongoose.model("post", postSchema);