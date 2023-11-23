import postSchema from "../models/postSchema.js"

export const findAll = (offset, limit) => postSchema.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

export const createService = (post) => new postSchema(post).save();

export const countPost = () => postSchema.countDocuments();

export const findByPostId = (id) => postSchema.findById(id).populate("user");

export const searchPostByTitle = (text) => postSchema.find({
  text: { $regex: `${text || ""}`, $options: "i" },
}).sort({ _id: -1 }).populate("user");

export const byUserService = (id) => postSchema.find({ user: id }).sort({ _id: -1 }).populate("user");

export const postUpdateservice = (id, text, image) => postSchema.findOneAndUpdate({ _id: id }, { text, image }, { rawResult: true })

export const postDeleteService = (id) => postSchema.findByIdAndDelete({ _id: id });

export const postLikeService = (id, userId) => postSchema.findOneAndUpdate(
  { _id: id, "likes.userId": { $nin: [userId] } },
  { $push: { likes: { userId, createdAt: new Date() } } })

export const deleteLikePost = (id, userId) => postSchema.findOneAndUpdate(
  { _id: id },
  { $pull: { likes: { userId } } });

export const postCommentService = (id, userId, comment) => {
  const idComment = Math.floor(Date.now() * Math.random()).toString(36);

  return postSchema.findByIdAndUpdate(
    { _id: id },
    {
      $push: {
        comments: { idComment, userId, comment, createdAt: new Date() },
      },
    },
  );
}

export const deleteCommentService = (idPost, idComment, userId) => postSchema.findByIdAndUpdate(
  { _id: idPost },
  { $pull: { comments: { idComment, userId } } })