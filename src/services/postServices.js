import { createPostRepository, } from "../repositories/postRepositories.js"

export const createPostService = async (image, text, user) => {

  if (!image || !text) throw new Error("Send all fields for posting");

  const postCreated = await createPostRepository({ image, text, user });

  return postCreated;
};

const getAll = async (req, res) => {
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


    const posts = await findAll(offset, limit);
    const total = await countPost()
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}?limit=${limit}offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}?limit=${limit}offset=${previous}` : null;

    if (posts.length === 0) {
      return res.status(400).json({ msg: "There are no registered post" });
    }

    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: posts.map((item) => ({
        id: item._id,
        image: item.image,
        text: item.text,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.userName,
        userAvatar: item.user.avatar,
        createdAt: item.createdAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
}

const getById = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(404).json({ msg: "Post id required" });
    }

    const postFound = await findByPostId(postId);

    if (!postFound.length === 0) {
      return res.status(400).json({ msg: "Post not found" });
    }

    res.status(200).json({
      postFound: {
        id: postFound._id,
        image: postFound.image,
        text: postFound.text,
        likes: postFound.likes,
        comments: postFound.comments,
        name: postFound.user.name,
        userName: postFound.user.userName,
        userPhoto: postFound.user.photo,
        createdAt: postFound.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
}

const searchByTitle = async (req, res) => {
  try {
    const { text } = req.query;
    const postFound = await searchPostByTitle(text);

    if (postFound.length === 0) {
      return res.status(400).json({ msg: "There are no post with this text" })
    }

    return res.status(200).json({
      results: postFound.map((item) => ({
        id: item._id,
        image: item.image,
        text: item.text,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.userName,
        userPhoto: item.user.photo,
        createdAt: item.createdAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
}

const byUser = async (req, res) => {
  try {
    const id = req.userId;
    const postFound = await byUserService(id);

    return res.status(200).json({
      results: postFound.map((item) => ({
        id: item._id,
        image: item.image,
        text: item.text,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.userName,
        userPhoto: item.user.photo,
        createdAt: item.createdAt
      }))
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
}

const postUpdate = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id } = req.params;

    if (!image && !text) {
      return res.status(422).json({ msg: "Send all fields for posting" })
    }

    const postFound = await findByPostId(id);


    if (String(req.userId) !== String(postFound.user._id)) {
      return res.status(400).json({
        msg: "You didn't update this post"
      });
    }

    await postUpdateservice(id, text, image);

    return res.status(201).json({
      msg: "Post successfully updated"
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }
}

const postDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const postFound = await findByPostId(id)

    if (String(req.userId) !== String(postFound.user._id)) {
      return res.status(400).json({
        msg: "You didn't update this post"
      });
    }

    await postDeleteService(id)

    return res.status(200).json({
      msg: "Post deleted successfully"
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }


}

const postLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await findByPostId(id);

    if (!post) {
      return res.status(400).json({ msg: "This post doesn't exist" })
    }
    const postLiked = await postLikeService(id, userId);

    if (!postLiked) {
      await deleteLikePost(id, userId);
      return res.status(200).json({
        msg: "Like successfully removed"
      });
    }

    res.json({ msg: "Like done successfully" });


  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    });
  }

}

const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    const post = await findByPostId(id);

    if (!post) {
      return res.status(400).json({ msg: "This post doesn't exist" })
    }

    if (!comment) {
      return res.status(400).json({ msg: "Write a message to comment" })
    }

    await postCommentService(id, userId, comment);

    res.status(200).json({ msg: "Comment successfully completed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    })
  }
}

const deleteComment = async (req, res) => {
  try {
    const { idPost, idComment } = req.params;
    const userId = req.userId;

    const post = await findByPostId(idPost);

    if (!post) {
      return res.status(400).json({ msg: "This post doesn't exist" })
    }

    const comment = post.comments.find((item) => item.idComment == idComment);

    if (!comment) {
      return res.status(400).json({ msg: "Comment no found" });
    }

    if (String(comment.userId) !== String(userId)) {
      return res.status(400).json({ msg: "You can't delete this" })
    }

    await deleteCommentService(idPost, idComment, userId);

    res.status(200).json({ msg: "Comment successfully removed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "server error, please try again later"
    })
  }
}

export default {

  getAll,
  getById,
  searchByTitle,
  byUser,
  postUpdate,
  postDelete,
  postLike,
  postComment,
  deleteComment,
}