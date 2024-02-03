import postSchema from "../models/postSchema.js"

export const createPostRepository = (
  image,
  text,
  user
) => new postSchema(
  image,
  text,
  user
).save();

export const findAllRepository = (offset, limit) => postSchema.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");


export const countPostRepository = () => postSchema.countDocuments();

export const findByPostIdRepository = (id) => postSchema.findById(id).populate("user");

export const searchPostByTitleRepository = (text) => postSchema.find({
  text: { $regex: `${text || ""}`, $options: "i" },
}).sort({ _id: -1 }).populate("user");

export const byUserRepository = (id) => postSchema.find({ user: id }).sort({ _id: -1 }).populate("user");

export const postUpdateRepository = (id, text, image) => postSchema.findOneAndUpdate({ _id: id }, { text, image }, { rawResult: true })

export const postDeleteRepository = (id) => postSchema.findByIdAndDelete({ _id: id });

export const postLikeRepository = (id, userId) => postSchema.findOneAndUpdate(
  { _id: id, "likes.userId": { $nin: [userId] } },
  { $push: { likes: { userId, createdAt: new Date() } } })

export const deleteLikePostRepository = (id, userId) => postSchema.findOneAndUpdate(
  { _id: id },
  { $pull: { likes: { userId } } });

export const postCommentRepository = (id, userId, comment) => {
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

export const deleteCommentRepository = (idPost, idComment, userId) => postSchema.findByIdAndUpdate(
  { _id: idPost },
  { $pull: { comments: { idComment, userId } } })